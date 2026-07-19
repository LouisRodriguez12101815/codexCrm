import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { ensureSchema, q } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { checkCooldown, isUsNumber, stamp } from '@/lib/twilioGuard';

export async function POST(req: Request) {
  await requireAuth();
  await ensureSchema();

  const form = await req.formData();
  const leadId = form.get('leadId')?.toString();
  const to = form.get('to')?.toString() || '';

  let status = 'blocked';
  let sid: string | null = null;
  let reason: string | null = null;

  if (process.env.TWILIO_ENABLED !== 'true' || process.env.CALLS_ENABLED !== 'true') {
    reason = 'Calls disabled by kill switch';
  } else if (!isUsNumber(to)) {
    reason = 'Only US +1 E.164 numbers are allowed';
  } else {
    const cooldownRemaining = await checkCooldown('call');

    if (cooldownRemaining) {
      reason = `Call rate limit active; retry in ${cooldownRemaining}`;
    } else {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const call = await client.calls.create({
        from: process.env.TWILIO_FROM_NUMBER!,
        to,
        twiml: '<Response><Say>This is a CodexCRM demo call. Goodbye.</Say></Response>',
      });

      sid = call.sid;
      status = call.status;
      await stamp('call');
    }
  }

  await q(
    'INSERT INTO calls(lead_id,sid,from_number,to_number,status,blocked_reason) VALUES($1,$2,$3,$4,$5,$6)',
    [leadId, sid, process.env.TWILIO_FROM_NUMBER, to, status, reason],
  );

  if (leadId) {
    await q('INSERT INTO activities(lead_id,type,body) VALUES($1,$2,$3)', [
      leadId,
      'call',
      reason ? `Call blocked: ${reason}` : `Call ${status} SID ${sid}`,
    ]);
  }

  return NextResponse.redirect(new URL(leadId ? `/leads/${leadId}` : '/leads', req.url));
}
