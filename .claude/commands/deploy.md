# Deploy Workflow

## Steps
1. **Build Verification**: Run `npm run build` locally.
2. **Test Run**: Execute `npm test` and ensure all tests pass.
3. **Environment Prep**: Verify `.env` variables for production.
4. **Command**:
   - For Vercel: `vercel --prod`
   - For Firebase: `firebase deploy`

## Checklist
- [ ] Production build succeeds.
- [ ] No console errors in the build output.
- [ ] Meta tags and SEO assets are correctly bundled.
- [ ] SSL/TLS is active for the target domain.
