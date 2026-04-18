# Error Handling Rules

## Patterns
- **AppError Class**: Use a custom `AppError` class for operational errors.
- **Try/Catch**: Use in async functions.
- **Global Handler**: Centralized error management in the layout or root.

## UX
- Always show a user-friendly error message.
- Log error details for debugging (Production: Sentry/LogRocket, Dev: Console).
- Recovery: Provide a "Retry" or "Home" call-to-action on error pages.
