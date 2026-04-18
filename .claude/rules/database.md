# Database Patterns

## Prisma (Template)
- Use transactions for multiple related updates.
- Avoid N+1 queries by using `include`.
- Always type-safe results.

## Firebase (Current)
- Denormalize data for performance where scale is needed.
- Write-first mindset (Security Rules).
- Use `getServerSideProps` or React hooks for data fetching.
