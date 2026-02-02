# Quick Start Guide

## ⚠️ Prerequisites Check

Before starting, ensure you have:

1. **Node.js 18+** installed - Check with: `node -v`
2. **pnpm** installed - Check with: `pnpm -v` (Install: `npm install -g pnpm`)
3. **Docker Desktop** installed and **running** - Check with: `docker ps`

## 🚀 Quick Start Steps

### Step 1: Start Docker Desktop

**IMPORTANT**: Make sure Docker Desktop is running before proceeding.

Open Docker Desktop application and wait for it to fully start (you'll see a green "running" indicator).

### Step 2: Start PostgreSQL Database

```bash
cd "c:\Users\acer\OneDrive\İş masası\Python\Python Projects\car-parts-sellings"
docker-compose up -d
```

Verify it's running:
```bash
docker ps
```

You should see `car-parts-db` container running.

### Step 3: Set up Database Schema

```bash
pnpm db:push
```

### Step 4: Seed Database with Sample Data

```bash
pnpm db:seed
```

This creates:
- Admin user: `admin@carparts.com` / `admin123`
- Test user: `user@test.com` / `user123`
- 6 categories, 6 brands, 25 sample products

### Step 5: Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## 🎯 What You Can Do Now

### As a Customer:
1. Browse products at http://localhost:3000/shop
2. Search and filter by categories, brands, price
3. View product details with compatibility info
4. Add items to cart (stored in browser)
5. Register an account or login
6. Checkout (Stripe test mode - use card: 4242 4242 4242 4242)

### As an Admin:
1. Login with: `admin@carparts.com` / `admin123`
2. Access admin dashboard at http://localhost:3000/admin
3. Manage products, categories, brands
4. View and update orders
5. Track inventory and stock

## 📋 Database Management Commands

```bash
# View database in browser (Prisma Studio)
pnpm db:studio
# Opens at http://localhost:5555

# Create new migration
pnpm db:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Re-seed database
pnpm db:seed
```

## 🔧 Troubleshooting

### "Docker is not running"
- Open Docker Desktop application
- Wait for it to fully start (green indicator)
- Try `docker ps` to verify it's working

### "Port 3000 already in use"
```bash
# Kill process on port 3000
npx kill-port 3000

# Or change port
pnpm dev -- -p 3001
```

### "Database connection error"
```bash
# Stop and restart PostgreSQL
docker-compose down
docker-compose up -d

# Wait 10 seconds, then:
pnpm db:push
```

### Prisma Client errors
```bash
npx prisma generate
```

## 🎨 Customization

### Update Colors
Edit `src/app/globals.css` - Change HSL values in `:root`

### Add More Products
1. Use Prisma Studio: `pnpm db:studio`
2. Or edit `prisma/seed.ts` and run `pnpm db:seed`

### Configure Stripe (for real payments)
1. Get API keys from https://stripe.com
2. Add to `.env`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   ```
3. For webhooks locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

## 📚 Key Files to Edit

- `src/app/page.tsx` - Home page
- `src/app/shop/page.tsx` - Shop page
- `src/components/layout/header.tsx` - Main navigation
- `src/app/admin/*` - Admin pages
- `prisma/schema.prisma` - Database schema
- `src/lib/utils.ts` - Utility functions

## 🚢 Deploy to Production

See full deployment guide in [README.md](README.md)

Quick deploy to Vercel:
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

For database, use:
- **Neon** (recommended): https://neon.tech
- **Supabase**: https://supabase.com

---

Need help? Check [README.md](README.md) for detailed documentation!
