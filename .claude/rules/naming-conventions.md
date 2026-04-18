# Naming Conventions (Data & Infra)

## Infrastructure
- **Cache Keys**: `project:entity:id` (e.g., `foodtour:tours:123`).
- **ENV Vars**: `VITE_APP_NAME`, `PROD_DB_URL`.
- **Queues**: `job-type-queue`.

## Database
- **Collections (Firestore)**: `tours`, `reviews`, `users` (plural).
- **Fields**: `camelCase`.
- **Primary Keys**: UUID or unique random strings.
