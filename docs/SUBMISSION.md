# CodexCRM Devpost submission checklist

## Public judge demo

- Repo URL: https://github.com/LouisRodriguez12101815/codexCrm
- Live demo URL: http://204.236.254.26:3000/
- Shared login: `demo@codexcrm.local` / `codexcrm-demo`
- Track: Work and productivity
- Video: `PASTE_YOUTUBE_URL`
- `/feedback` Session ID: `[PASTE_YOUR_ID]`
- License: MIT


## Judge 90-second walkthrough

1. Log in to http://204.236.254.26:3000/ with `demo@codexcrm.local` / `codexcrm-demo`.
2. Open a seeded lead from the lead list.
3. Read the Twilio status panel: the live demo has Twilio enabled, with separate SMS and call cooldown messages.
4. Try one compliant SMS or demo call to a US `+1` number. The shared demo allows 1 SMS and 1 call per hour; blocked, cooled-down, or Twilio-side failures are saved to the timeline with judge-friendly reasons.
5. Add a note or change lead status to verify the core CRM path.

## Live deployment notes

- Hosted AWS demo status: Twilio SMS and outbound calls are currently **enabled for judging**.
- Hard Twilio caps: **1 outbound SMS per hour** and **1 outbound call per hour** for the shared demo scope.
- Destination limits: US `+1` E.164 phone numbers only.
- Safety controls: prohibited-content filtering remains active, and `TWILIO_ENABLED`, `SMS_ENABLED`, and `CALLS_ENABLED` remain available as kill switches.
- Spend control: these caps are intentional to limit Twilio spend during the hackathon while still letting judges verify the live outreach workflow.
- Local/docker difference: `.env.example` may keep Twilio disabled by default for local and Docker runs; the live AWS judge demo intentionally differs.
- HTTP demo config: use `APP_BASE_URL=http://204.236.254.26:3000` and keep `COOKIE_SECURE=false` for the current HTTP-hosted demo. Use `COOKIE_SECURE=true` only behind HTTPS.

## Verification checklist

- Local run path verified: `npm ci`, `npm run db:setup`, `npm run db:seed`, `npm run dev`
- Production-style build verified: `npm run build`
- Docker files included: `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- No secrets in git: `.env`, `.env.aws`, `*.pem`, `node_modules`, and `.next` are ignored
- Twilio safety documented: live status, hourly SMS/call caps, US-only numbers, content filter, and kill switches are documented

## Human before final Devpost submit

1. Paste the final demo video link in `README.md` and this checklist if it is available before submission.
2. Confirm the live EC2 URL is still reachable.
3. Keep all real Twilio, AWS, and database credentials outside git.
