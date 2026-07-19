# AWS deployment guide

The live judge demo is already deployed. Do **not** recreate AWS infrastructure unless the demo is broken.

## Current live demo: EC2 + Docker Compose

- URL: http://204.236.254.26:3000/
- Login: `demo@codexcrm.local` / `codexcrm-demo`
- Region: `us-east-1`
- EC2 tag: `Name=codexcrm-demo`
- Runtime: Docker Compose with Postgres and Next.js
- Public app port: `3000`

Recommended environment values for the HTTP EC2 demo:

```bash
APP_BASE_URL=http://204.236.254.26:3000
COOKIE_SECURE=false
DATABASE_URL=postgres://postgres:postgres@postgres:5432/codexcrm
DEMO_EMAIL=demo@codexcrm.local
DEMO_PASSWORD=codexcrm-demo
DEMO_SESSION_SECRET=<strong-random-value-kept-out-of-git>
TWILIO_ENABLED=false
SMS_ENABLED=false
CALLS_ENABLED=false
PGSSLMODE=disable
```

`APP_BASE_URL` keeps redirects pointed at the public host instead of an internal Docker hostname. `COOKIE_SECURE=false` keeps demo auth working over the current HTTP URL. If the demo is moved behind HTTPS, set `APP_BASE_URL` to the HTTPS origin and `COOKIE_SECURE=true`.

## Update the EC2 demo after merging

From the app directory on the instance:

```bash
git pull origin main
docker compose up --build -d
```

If the database volume already exists, the app command can safely run schema setup and sample seeding again.

## Local Docker Compose smoke test

```bash
docker compose up --build
```

Then open <http://localhost:3000/> and log in with the shared demo account.

## Twilio demo controls

- Keep `TWILIO_ENABLED=false` unless actively demonstrating Twilio.
- Enable `SMS_ENABLED=true` and/or `CALLS_ENABLED=true` only for opted-in/test recipients.
- Never commit `TWILIO_AUTH_TOKEN`, AWS keys, database passwords, `.env`, `.env.aws`, or PEM files.
- The app still enforces US-only phone numbers, prohibited-content filtering, attempt logging, and one-hour shared cooldowns.

## Optional future path: AWS App Runner + RDS

App Runner provides managed HTTPS quickly, while RDS keeps CRM data in the AWS account.

1. Create Amazon RDS PostgreSQL with a private endpoint where possible.
2. Store database and demo secrets in AWS Secrets Manager or SSM Parameter Store.
3. Configure App Runner from this GitHub repo:
   - Build command: `npm ci && npm run build`
   - Start command: `npm run start`
   - Port: `3000`
   - Environment values from `.env.example`
   - `APP_BASE_URL=https://<app-runner-url>`
   - `COOKIE_SECURE=true`
   - `PGSSLMODE=require` for RDS TLS
4. Run `npm run db:setup` and `npm run db:seed` once with the production `DATABASE_URL`.
