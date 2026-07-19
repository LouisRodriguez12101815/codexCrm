# CodexCRM Devpost submission checklist

## Public judge demo

- Repo URL: https://github.com/LouisRodriguez12101815/codexCrm
- Live demo URL: http://204.236.254.26:3000/
- Shared login: `demo@codexcrm.local` / `codexcrm-demo`
- Track: Work and productivity
- Video: `PASTE_YOUTUBE_OR_DEVPOST_VIDEO_LINK`
- `/feedback` Session ID: `PASTE_FEEDBACK_ID`
- License: MIT

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

1. Paste the real `/feedback` Session ID in `README.md` and this checklist.
2. Paste the final demo video link in `README.md` and this checklist.
3. Confirm the live EC2 URL is still reachable.
4. Keep all real Twilio, AWS, and database credentials outside git.
