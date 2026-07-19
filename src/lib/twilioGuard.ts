import { q } from './db';
export function isUsNumber(n:string){ return /^\+1\d{10}$/.test(n); }
const blocked=[/illegal\s*drugs?/i,/weapons?/i,/phish/i,/password|verification code|otp/i,/hate/i,/adult|sexual/i,/harass/i,/buy now|act now|limited time/i,/fraud|scam/i];
export function smsBlockReason(body:string){ const hit=blocked.find(r=>r.test(body)); return hit ? `Blocked by safety policy: ${hit.source}` : null; }
export async function checkCooldown(kind:'sms'|'call'){ await q("INSERT INTO rate_limits(scope) VALUES('demo') ON CONFLICT DO NOTHING"); const col=kind==='sms'?'last_sms_at':'last_call_at'; const {rows}=await q<{remaining:string}>(`SELECT GREATEST(INTERVAL '0', INTERVAL '1 hour' - (now() - ${col}))::text remaining FROM rate_limits WHERE scope='demo' AND ${col} IS NOT NULL AND now() - ${col} < INTERVAL '1 hour'`); return rows[0]?.remaining || null; }
export async function stamp(kind:'sms'|'call'){ await q(`INSERT INTO rate_limits(scope,last_${kind}_at) VALUES('demo',now()) ON CONFLICT(scope) DO UPDATE SET last_${kind}_at=now()`); }
