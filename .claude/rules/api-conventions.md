# API Conventions

## REST Standards
- **Nouns for Resources**: `/tours`, not `/getTours`.
- **HTTP Methods**: GET (read), POST (create), PUT/PATCH (update), DELETE (remove).
- **Versioning**: Header-based or URL based `/v1/`.

## Response Envelopes
```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional feedback"
}
```
- Standard Status Codes: 200, 201, 400, 401, 403, 404, 500.
