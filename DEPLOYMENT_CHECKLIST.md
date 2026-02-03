# Pre-Deployment Checklist for Vercel

## ✅ Code Quality
- [x] All ESLint errors fixed (react/no-unescaped-entities)
- [x] All TypeScript compilation errors resolved
- [x] Prisma client properly generated
- [x] Dynamic pages properly marked (`export const dynamic = 'force-dynamic'`)

## ✅ Build Status
- [x] `pnpm build` completes successfully
- [x] No compilation errors
- [x] No type checking errors
- [x] Build artifacts generated in `.next/`

## 📋 Environment Configuration
- [ ] Create PostgreSQL database (Vercel, Neon, Supabase, Railway, etc.)
- [ ] Set `DATABASE_URL` in Vercel environment variables
- [ ] Set `NEXTAUTH_SECRET` (generate: `openssl rand -base64 32`)
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Set Stripe API keys (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
- [ ] Set `STRIPE_WEBHOOK_SECRET`
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Optional: Add Cloudinary keys for image uploads

## 🔐 Security
- [x] `.env` file excluded from git (.gitignore)
- [x] Sensitive keys use environment variables
- [ ] Production NEXTAUTH_SECRET is strong (32+ characters)
- [ ] Stripe webhook signature verified on server

## 🗄️ Database
- [ ] PostgreSQL database created and accessible
- [ ] Run `pnpm prisma migrate deploy` after deployment
- [ ] Optional: Run `pnpm prisma db seed` to populate sample data
- [ ] Backup strategy in place

## 🔗 External Services
- [ ] Stripe account configured (test or live keys)
- [ ] Stripe webhook endpoint configured: `/api/webhooks/stripe`
- [ ] NextAuth secret properly stored (never commit to repo)

## 📱 Testing Before Deploy
```bash
# Local test build
pnpm build

# Check for errors
pnpm prisma generate

# Test dynamic pages work with DATABASE_URL set
pnpm dev
```

## 🚀 Deployment
1. Push code to GitHub repository
2. Connect repository to Vercel project
3. Add all environment variables in Vercel dashboard
4. Enable deployment
5. Vercel will automatically:
   - Install dependencies
   - Generate Prisma client
   - Build Next.js application
   - Deploy to production

## ✨ Post-Deployment
- [ ] Verify home page loads
- [ ] Test navigation links
- [ ] Check product listings
- [ ] Test authentication (login/register)
- [ ] Monitor Vercel logs for errors
- [ ] Set up monitoring/alerts

## 📞 Support
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- NextAuth Docs: https://next-auth.js.org
