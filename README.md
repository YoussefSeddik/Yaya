
# myStore - Egyptian E-commerce Platform

A complete e-commerce solution for fashion reselling in Egypt with an integrated admin dashboard. Built with **Next.js**, **Supabase**, and **Vercel**.

## Features

### Customer-Facing Store
- 🛍️ Browse products by category
- 🛒 Shopping cart with quick add/remove
- 💳 Checkout flow
- 📱 Fully responsive design
- ⚡ Fast and SEO-optimized

### Admin Dashboard
- 📊 Real-time business metrics (revenue, profit, pending orders, low stock)
- 📦 Order management with status tracking (pending → confirmed → shipped → delivered)
- 🏷️ Printable shipping labels
- 🆔 Product inventory management with profit margins
- 👥 Customer database with order history
- 📝 Database schema included
- 💰 Profit tracking (cost vs selling price)
- 🌍 Multi-source order tracking (website, Instagram, WhatsApp, Facebook)

## Tech Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| **Frontend** | Next.js 15 + React 19 | Fast, SEO-friendly, full-stack capability |
| **Database** | Supabase (PostgreSQL) | Free tier, built-in Auth, real-time |
| **Hosting** | Vercel | Free tier, seamless Next.js integration |
| **Domain** | Cloudflare Registrar | Cheapest (~$10/year), no hidden fees |
| **Payments** | Paymob or Fawry | Egypt-best payment gateways |

## Total Cost

- **$0/month** (hosting and database)
- **~$10/year** (domain only)
- **~2-4% per transaction** (payment gateway)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to **Settings → API** and copy your keys:
```bash
cp .env.local.example .env.local
```
3. Paste your Supabase URL and Anon Key into `.env.local`

### 3. Create Database Tables
1. In Supabase SQL Editor, copy the SQL schema from `/admin` dashboard
2. Run the SQL to create all tables

### 4. Run Locally
```bash
npm run dev
```

- **Store**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full guide.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # Store homepage
│   │   ├── admin/page.tsx        # Admin dashboard
│   │   ├── components/           # Reusable components
│   │   ├── data/mockData.ts      # Sample data
│   │   ├── types/index.ts        # TypeScript types
│   │   └── globals.css           # Global styles
│   └── lib/
│       └── supabase/             # Supabase config
├── package.json
├── next.config.js
└── README.md
```

## Next Steps

1. Set up Supabase database
2. Configure environment variables
3. Test locally
4. Deploy to Vercel
5. Configure Paymob/Fawry payments
6. Buy domain and connect

---

**Built for Egyptian e-commerce. Made with ❤️ for digital retail success.**
  