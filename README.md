# CarParts - Car Spare Parts E-Commerce Platform

A production-ready full-stack e-commerce web application for selling car spare parts, built with Next.js 14, TypeScript, Prisma, PostgreSQL, NextAuth, and Stripe.

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse car parts by categories, brands, and compatibility
- **Advanced Search & Filters**: Filter by price, condition, car make/model/year
- **Product Details**: Comprehensive product information with compatibility data
- **Shopping Cart**: Client-side cart with localStorage persistence
- **Checkout**: Secure Stripe payment integration
- **User Accounts**: Order history and profile management
- **Responsive Design**: Mobile-first, fully responsive UI

### Admin Features
- **Dashboard**: Overview of products, orders, users, and revenue
- **Product Management**: Full CRUD for products with image upload
- **Category Management**: Organize products into categories
- **Brand Management**: Manage car part brands
- **Order Management**: View and update order statuses
- **User Management**: View and manage users
- **Inventory Tracking**: Stock management

### Technical Features
- **Authentication**: NextAuth with credentials and Google OAuth (scaffold)
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe checkout integration
- **Image Upload**: Cloudinary integration with local fallback
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Zod schema validation
- **State Management**: Zustand for cart management
- **Styling**: TailwindCSS with shadcn/ui components

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose (for PostgreSQL)
- Stripe account (for payments)
- Cloudinary account (optional, for image uploads)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd car-parts-sellings
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/carparts?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# Cloudinary (optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

Verify PostgreSQL is running:

```bash
docker ps
```

### 5. Set up the database

Run Prisma migrations:

```bash
pnpm db:push
```

Or create and run migrations:

```bash
pnpm db:migrate
```

### 6. Seed the database

```bash
pnpm db:seed
```

This will create:
- Admin user: `admin@carparts.com` / `admin123`
- Test user: `user@test.com` / `user123`
- 6 categories
- 6 brands
- 25 sample products

### 7. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
car-parts-sellings/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seed script
├── public/
│   └── uploads/               # Local image uploads (dev)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Registration page
│   │   ├── admin/
│   │   │   ├── layout.tsx     # Admin layout with sidebar
│   │   │   ├── page.tsx       # Admin dashboard
│   │   │   ├── products/      # Product management
│   │   │   ├── categories/    # Category management
│   │   │   ├── brands/        # Brand management
│   │   │   ├── orders/        # Order management
│   │   │   └── users/         # User management
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth API routes
│   │   │   ├── checkout/      # Stripe checkout
│   │   │   └── webhooks/      # Stripe webhooks
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout page
│   │   ├── products/
│   │   │   └── [slug]/        # Product detail page
│   │   ├── shop/              # Shop with filters
│   │   ├── account/           # User account page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx     # Main header
│   │   │   └── footer.tsx     # Main footer
│   │   ├── product/           # Product components
│   │   ├── ui/                # shadcn/ui components
│   │   └── providers.tsx      # Session provider
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Utility functions
│   ├── store/
│   │   └── cart.ts            # Zustand cart store
│   └── types/
│       └── next-auth.d.ts     # NextAuth type definitions
├── .env.example               # Environment variables template
├── .gitignore
├── docker-compose.yml         # PostgreSQL container
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🗄️ Database Schema

### Main Models

- **User**: User accounts with role-based access (USER/ADMIN)
- **Product**: Car parts with detailed specifications
- **Category**: Product categories (hierarchical)
- **Brand**: Car part brands
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items in an order
- **Wishlist**: User wishlist items

### Product Features

- Title, slug, description
- Price with discount support
- SKU, barcode
- Category and brand relations
- Condition (NEW/USED)
- Stock quantity
- Multiple images with main image
- Car compatibility (make, model, year range, engine, gearbox)
- JSON attributes for flexible specifications

## 💳 Stripe Integration

### Setup Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys from the Dashboard
3. Add keys to `.env`:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`

### Test Stripe Webhooks Locally

Install Stripe CLI:

```bash
# Windows (with Scoop)
scoop install stripe

# Or download from https://stripe.com/docs/stripe-cli
```

Forward webhook events to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret to your `.env`:

```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Test Cards

Use these test cards for checkout:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and CVC

## 🖼️ Image Uploads

### Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard
3. Add to `.env`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Local Fallback

For development without Cloudinary, images are saved to `public/uploads/`.

## 📊 Prisma Studio

View and edit database data with Prisma Studio:

```bash
pnpm db:studio
```

Opens at [http://localhost:5555](http://localhost:5555)

## 🧪 Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:push          # Push schema changes to database
pnpm db:migrate       # Create and run migrations
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database for Production

Use a managed PostgreSQL service:

- **Neon**: [neon.tech](https://neon.tech) (Recommended, free tier)
- **Supabase**: [supabase.com](https://supabase.com)
- **Railway**: [railway.app](https://railway.app)

Update `DATABASE_URL` in Vercel environment variables.

### Stripe Production

1. Switch to live API keys in Vercel environment variables
2. Configure production webhook endpoint in Stripe Dashboard:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`
3. Update `STRIPE_WEBHOOK_SECRET` with production webhook secret

### Environment Variables for Production

Ensure all environment variables are set in Vercel:

- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Cloudinary credentials (if using)

## 🔒 Security Features

- Password hashing with bcryptjs
- Session management with NextAuth
- Input validation with Zod
- SQL injection protection with Prisma
- CSRF protection built-in
- Secure headers configured
- Role-based access control

## 🎨 Customization

### Styling

- Edit `src/app/globals.css` for global styles
- Modify `tailwind.config.ts` for theme colors
- Update shadcn/ui components in `src/components/ui/`

### Add More Product Attributes

Update `prisma/schema.prisma`:

```prisma
model Product {
  // ... existing fields
  weight      Float?
  dimensions  String?
  warranty    Int?
}
```

Then run:

```bash
pnpm db:migrate
```

## 📱 Demo Credentials

**Admin Account:**
- Email: `admin@carparts.com`
- Password: `admin123`

**Test User:**
- Email: `user@test.com`
- Password: `user123`

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Stop containers
docker-compose down

# Remove volumes and restart
docker-compose down -v
docker-compose up -d

# Re-run migrations
pnpm db:push
pnpm db:seed
```

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or change port in package.json
"dev": "next dev -p 3001"
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npx prisma generate
```

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 14, TypeScript, Prisma, and Stripe
