# Skill: Automated Testing (QA Autopilot)

## Overview
Continuous quality assurance for the food tour platform, triggered by CI/CD events.

## Instructions
- **Triggers**: 
  - Git Push to `staging` or `main`.
  - Vercel Deployment Hook.
- **Critical Test Suites**:
  - **Booking Flow**: Verify the "Plan Tour" button leads to the itinerary generator.
  - **Map Rendering**: Ensure markers load correctly from Firestore and Mapbox doesn't return 401.
  - **Auth State**: Verify protected routes (Passport/Profile) redirect to Login if unauthenticated.
  - **Responsive Layout**: Check for layout breaks on Mobile vs Desktop viewports.
- **Reporting**:
  - Success: Log to GitHub Actions and notify Project Manager agent.
  - Failure: **BLOCK DEPLOYMENT**, create a "Fix-Issue" command task, and ping the Developer agent with the stack trace.
- **Tooling**: Playwright for E2E, Vitest for unit logic.
