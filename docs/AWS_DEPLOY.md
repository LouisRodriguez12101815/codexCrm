# AWS deployment guide

Recommended deployment: **AWS App Runner + Amazon RDS PostgreSQL**. App Runner provides managed HTTPS quickly, while RDS keeps CRM data in the AWS account.

## 1. Create RDS PostgreSQL

- Engine: PostgreSQL
- Instance: `db.t4g.micro` or smallest eligible free-tier/tiny instance
- Public access: off when using VPC connector; temporarily restricted to your IP only if needed for setup
- Database name: `codexcrm`
- Store username/password in AWS Secrets Manager or SSM Parameter Store

## 2. Configure App Runner

1. Connect the GitHub repository.
2. Runtime: Node.js.
3. Build command: `npm ci && npm run build`.
4. Start command: `npm run start`.
5. Port: `3000`.
6. Add environment variables from `.env.example`.
7. Set `PGSSLMODE=require` for RDS TLS.
8. Attach a VPC connector that can reach RDS.

## 3. Initialize database

Run a one-off task from a trusted machine or AWS CloudShell with the production `DATABASE_URL`:

```bash
npm ci
npm run db:setup
npm run db:seed
```

## 4. Twilio production demo settings

- Set `TWILIO_ENABLED=true` only during demos.
- Set `SMS_ENABLED=true` and `CALLS_ENABLED=true` only if the purchased US Twilio number is verified/ready.
- Keep the app-level one-hour SMS and call cooldowns enabled.
- Use no real customer PII for Devpost judging.

## 5. Cost controls

- Use the smallest RDS instance and stop/delete it after judging if not needed.
- Keep App Runner min instances at the lowest setting.
- Disable Twilio kill switches outside demos.
