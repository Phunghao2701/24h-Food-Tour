# 🔒 CRITICAL Security Rules

## Rules
- **Authentication**: Never trust the client. Verify JWTs on the server.
- **Authorization**: Role-based access control (RBAC).
- **Data Masking**: PII (Personally Identifiable Information) must be encrypted/masked.
- **CSRF/XSS**: Use standard library protections.
- **Security Headers**: No Sniff, HSTS, CSP.
- **Secrets**: NEVER commit API keys or secrets to the repo. Use `.env`.
