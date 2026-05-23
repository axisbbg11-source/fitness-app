Backend deploy checklist — FitCoach

1. Environment variables

- `OPENROUTER_API_KEY` — required for AI calls
- `ALLOWED_ORIGIN` — set to your frontend origin (e.g., https://app.yourdomain.com)
- `NODE_ENV` — set to `production`
- (optional) `PORT` — default 3001

2. Install & run

```bash
cd backend
npm install
npm start
```

3. Recommended production hardening

- Use a process manager (PM2 or systemd) or host on a managed platform.
- Ensure HTTPS is enabled by your host or behind a proxy/load balancer.
- Configure SPF/DKIM/DMARC if sending email.
- Enable monitoring/logging (Sentry, Logflare, Papertrail).
- Run `npm audit fix` and review vulnerabilities.

4. Health & metrics

- App exposes `/health` endpoint for readiness checks.
- Configure a simple uptime check to hit `/health`.

5. Deployment notes

- `vercel.json` is configured for SPA rewrites — backend must be hosted separately or converted to serverless functions.
- Ensure `ALLOWED_ORIGIN` matches your deployed frontend origin.

6. Rollback

- Keep previous build artifacts or have a pinned image tag for quick rollback.
