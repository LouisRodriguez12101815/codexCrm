# CodexCRM Devpost submission checklist

- Repo URL: https://github.com/LouisRodriguez12101815/codexCrm
- Live demo URL: http://204.236.254.26:3000/
- Shared login: `demo@codexcrm.local` / `codexcrm-demo`
- Track: Work and productivity
- Video: `PASTE_YOUTUBE_OR_DEVPOST_VIDEO_LINK`
- `/feedback` Session ID: `PASTE_FEEDBACK_ID`
- License: MIT
- Local run path verified: `npm ci`, `npm run db:setup`, `npm run db:seed`, `npm run dev`
- Production-style build verified: `npm run build`
- Docker files included: `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- No secrets in git: `.env`, `.env.aws`, `*.pem`, `node_modules`, and `.next` are ignored
- Twilio safety documented: `TWILIO_ENABLED`, `SMS_ENABLED`, and `CALLS_ENABLED` remain kill switches

## Human before final Devpost submit

1. Paste the real `/feedback` Session ID in `README.md` and this checklist.
2. Paste the final demo video link in `README.md` and this checklist.
3. Confirm the live EC2 URL is still reachable.
4. Keep all real Twilio, AWS, and database credentials outside git.
