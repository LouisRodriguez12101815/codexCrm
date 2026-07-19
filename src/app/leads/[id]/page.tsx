import { requireAuth } from '@/lib/auth';
import { ensureSchema, q } from '@/lib/db';
import { getTwilioStatus } from '@/lib/twilioGuard';

function StatusLine({ label, enabled, cooldown }: { label: string; enabled: boolean; cooldown: string | null }) {
  return (
    <p>
      <b>{label}:</b>{' '}
      <span className={enabled ? 'ok' : 'danger'}>{enabled ? 'enabled' : 'disabled'}</span>
      {' · '}
      {cooldown ? <span className="muted">cooldown remaining: {cooldown}</span> : <span className="muted">ready now</span>}
    </p>
  );
}

export default async function Detail({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  await ensureSchema();

  const { id } = await params;
  const lead = (await q('SELECT * FROM leads WHERE id=$1', [id])).rows[0];
  const acts = (await q('SELECT * FROM activities WHERE lead_id=$1 ORDER BY created_at DESC', [id])).rows;
  const twilioStatus = await getTwilioStatus();

  if (!lead) return <main className="wrap">Not found</main>;

  return (
    <main className="wrap">
      <a href="/leads">← Leads</a>
      <div className="card">
        <h1>{lead.name}</h1>
        <p>
          {lead.company} · {lead.phone} · {lead.email}
        </p>
        <form action="/api/leads" method="post" className="row">
          <input type="hidden" name="id" value={lead.id} />
          <select name="status" defaultValue={lead.status}>
            <option>new</option>
            <option>contacted</option>
            <option>qualified</option>
            <option>closed</option>
          </select>
          <button>Change status</button>
        </form>
      </div>
      <div className="grid">
        <div className="card">
          <h2>Note</h2>
          <form action="/api/leads" method="post">
            <input type="hidden" name="id" value={lead.id} />
            <textarea name="note" placeholder="Add note" />
            <button>Add note</button>
          </form>
        </div>
        <div className="card">
          <h2>SMS / Call</h2>
          <div className="statusBox">
            <p>
              <b>Twilio:</b>{' '}
              <span className={twilioStatus.twilioEnabled ? 'ok' : 'danger'}>
                {twilioStatus.twilioEnabled ? 'enabled' : 'disabled'}
              </span>
            </p>
            <StatusLine label="SMS" enabled={twilioStatus.smsEnabled} cooldown={twilioStatus.smsCooldown} />
            <StatusLine label="Calls" enabled={twilioStatus.callsEnabled} cooldown={twilioStatus.callCooldown} />
          </div>
          <form action="/api/twilio/sms" method="post">
            <input type="hidden" name="leadId" value={lead.id} />
            <input name="to" defaultValue={lead.phone} />
            <textarea name="body" placeholder="Compliant message" />
            <button>Send SMS</button>
          </form>
          <hr />
          <form action="/api/twilio/call" method="post">
            <input type="hidden" name="leadId" value={lead.id} />
            <input name="to" defaultValue={lead.phone} />
            <button>Place call</button>
          </form>
        </div>
      </div>
      <div className="card">
        <h2>Timeline</h2>
        {acts.map((a: any) => (
          <p key={a.id}>
            <b>{a.type}</b> <span className="muted">{new Date(a.created_at).toLocaleString()}</span>
            <br />
            {a.body}
          </p>
        ))}
      </div>
    </main>
  );
}
