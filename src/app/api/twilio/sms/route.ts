import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { ensureSchema, q } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { checkCooldown, friendlyTwilioError, isUsNumber, smsBlockReason, stamp } from '@/lib/twilioGuard';

export async function POST(req: Request) {
  await requireAuth();
  await ensureSchema();

  const form = await req.formData();
  const leadId = form.get('leadId')?.toString();
  const to = form.get('to')?.toString() || '';
  const body = form.get('body')?.toString() || '';

  let status = 'blocked';
  let sid: string | null = null;
  let reason: string | null = null;

  if (process.env.TWILIO_ENABLED !== 'true' || process.env.SMS_ENABLED !== 'true') {
    reason = 'SMS disabled by kill switch';
  } else if (!isUsNumber(to)) {
    reason = 'Only US +1 E.164 numbers are allowed';
  } else {
    const contentBlockReason = smsBlockReason(body);

    if (contentBlockReason) {
      reason = contentBlockReason;
    } else {
      const cooldownRemaining = await checkCooldown('sms');

      if (cooldownRemaining) {
        reason = `SMS rate limit active; retry in ${cooldownRemaining}`;
      } else {
        try {
          const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
          const message = await client.messages.create({
            from: process.env.TWILIO_FROM_NUMBER,
            to,
            body,
          });

          sid = message.sid;
          status = message.status;
          await stamp('sms');
        } catch (error) {
          reason = friendlyTwilioError(error, 'SMS');
          status = 'failed';
        }
      }
    }
  }

  await q(
    'INSERT INTO messages(lead_id,sid,from_number,to_number,body,status,blocked_reason) VALUES($1,$2,$3,$4,$5,$6,$7)',
    [leadId, sid, process.env.TWILIO_FROM_NUMBER, to, body, status, reason],
  );

  if (leadId) {
    await q('INSERT INTO activities(lead_id,type,body) VALUES($1,$2,$3)', [
      leadId,
      'sms',
      reason ? `SMS ${status === 'failed' ? 'failed' : 'blocked'}: ${reason}` : `SMS ${status} SID ${sid}`,
    ]);
  }

  return NextResponse.redirect(new URL(leadId ? `/leads/${leadId}` : '/leads', req.url));
}
