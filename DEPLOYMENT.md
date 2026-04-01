# Complete Deployment & Setup Guide

This guide takes you from zero to a live e-commerce store serving Egyptian customers.

## 1. Supabase Database Setup (30 mins)

### Step 1.1: Create Supabase Project
1. Go to https://supabase.com and sign up
2. Click "New Project"
3. **Project name**: `mystore`
4. **Database password**: Save this securely (you'll need it later)
5. **Region**: `eu-west-1` (Ireland) — Best latency for Egypt
6. Click "Create new project"

_Wait ~5 minutes for the project to initialize._

### Step 1.2: Copy Your API Keys
1. Go to **Settings (gear icon)** → **API**
2. Find "Project URL" and "anon" key
3. Copy them — you'll need these in the next section

### Step 1.3: Create Database Schema
1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Go to your app's `/admin` dashboard page
4. Find the "DB Schema" tab at the bottom
5. Click "Copy SQL"
6. Paste into the Supabase SQL Editor
7. Click "Run" (the blue play button)

_Database is now ready with all tables!_

## 2. Local Development Setup (20 mins)

### Step 2.1: Get the Project Running
```bash
# Navigate to project
cd mystore-app

# Install dependencies
npm install
# or if using pnpm:
pnpm install
```

### Step 2.2: Configure Environment Variables
```bash
# Copy the example file
cp .env.local.example .env.local

# Open .env.local and fill in:
NEXT_PUBLIC_SUPABASE_URL=your_project_url_from_step_1_2
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_step_1_2
SUPABASE_SERVICE_ROLE_KEY=find_in_settings_api_service_key
```

> **Where to find Service Role Key**: Settings → API → "Service role" (at the bottom)

### Step 2.3: Start Development Server
```bash
npm run dev
```

Open:
- **Store**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

_You're now running the full app locally!_

## 3. Admin Users Setup (5 mins)

After running the schema (Step 1.3), you must create your first super admin manually via the Supabase dashboard.

### Step 3.1: Create First Super Admin in Supabase Auth

1. In your Supabase project, go to **Authentication → Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter your admin email and a strong password
4. Click **"Create user"** — copy the UUID shown

### Step 3.2: Insert into admin_users Table

Go to **SQL Editor** and run:

```sql
INSERT INTO admin_users (id, email, full_name, role, is_active)
VALUES (
  '<paste-uuid-from-step-3-1>',
  'youremail@example.com',
  'Your Name',
  'super_admin',
  true
);
```

### Step 3.3: Login to Admin Panel

- Visit `https://your-app.vercel.app/admin`
- You will be redirected to `/admin/login`
- Sign in with the credentials from Step 3.1
- You now have full super_admin access

### Step 3.4: Add More Admins

Once logged in as super_admin:
1. Go to **Admin Panel → Admins** (shield icon in sidebar)
2. Click **"Add Admin"**
3. Enter their name, email, temporary password, and role
4. They can log in at `/admin/login` immediately

**Roles:**
- `super_admin` — full access including admin user management
- `admin` — access to orders, products, customers, analytics

---

## 4. Vercel Deployment (15 mins)

### Step 4.1: Push to GitHub
```bash
# Initialize git if you haven't
git init
git add .
git commit -m "Initial commit: myStore ecommerce"

# Create GitHub repo and push
git branch -M main
git remote add origin https://github.com/your-username/mystore.git
git push -u origin main
```

### Step 4.2: Connect to Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New..." → "Project"
3. Select your `mystore` repository
4. Click "Import"
5. In "Environment Variables" section:
   - Add `NEXT_PUBLIC_SUPABASE_URL` from Step 1.2
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Step 1.2
   - Add `SUPABASE_SERVICE_ROLE_KEY` from Step 2.2
6. Click "Deploy"

_Your app is now live! Vercel will give you a URL like `mystore-abc123.vercel.app`_

## 5. Custom Domain Setup (15 mins)

### Step 5.1: Buy Domain from Cloudflare
1. Go to https://dash.cloudflare.com/domains
2. Search for your desired domain (e.g., `mystore.com`)
3. Register it (Cloudflare Registrar pricing: ~$10/year)
4. Complete purchase

### Step 5.2: Connect to Vercel
1. In Vercel dashboard, go to your project
2. **Settings** → **Domains**
3. Add domain: type your domain name
4. Vercel will show you **Nameserver** instructions
5. Copy the nameserver URLs
6. Go to Cloudflare → Your domain → **Nameservers**
7. Replace with Vercel's nameservers
8. Wait 24-48 hours for DNS to propagate

_Your store is now at `mystore.com`!_

## 6. Payment Gateway Integration (30-45 mins)

### Option A: Paymob (Recommended for Egypt)

#### Step 5.1: Create Paymob Account
1. Go to https://paymob.com/en/ and sign up
2. Verify email
3. Complete KYC requirements
4. Get your **API Key** from dashboard

#### Step 5.2: Add Environment Variables
```bash
# In Vercel → Project Settings → Environment Variables, add:
NEXT_PUBLIC_PAYMOB_API_KEY=your_paymob_api_key
PAYMOB_SECRET_KEY=your_paymob_secret
```

#### Step 5.3: Install Paymob SDK
```bash
npm install @paymob-tech/paymob
```

#### Step 5.4: Create Payment Route
Create `src/app/api/checkout.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { cartTotal, customerEmail, customerPhone } = body;

  // Initialize Paymob payment request
  const paymobUrl = 'https://accept.paymobsolutions.com/api/acceptance/payments/process';
  
  try {
    const response = await fetch(paymobUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.NEXT_PUBLIC_PAYMOB_API_KEY,
        amount: cartTotal * 100, // In cents
        currency: 'EGP',
        first_name: customerEmail.split('@')[0],
        email: customerEmail,
        phone_number: customerPhone,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
```

### Option B: Fawry (Alternative)

1. Go to https://www.fawry.com/ar/business and sign up
2. Get merchant code and API key
3. Same process as Paymob above

## 7. Order Management Setup

### Email Notifications (Optional)

```typescript
// src/lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOrderConfirmation(email: string, orderNumber: string) {
  await transporter.sendMail({
    from: 'noreply@mystore.com',
    to: email,
    subject: `Order ${orderNumber} Confirmed`,
    html: `Your order has been received!`,
  });
}
```

### SMS Notifications (Optional - via Twilio)

```typescript
// src/lib/sms.ts
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSMS(phone: string, message: string) {
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
}
```

## 7. Post-Launch Checklist

- [ ] Test store: Browse products, add to cart, confirm checkout
- [ ] Test admin: Create/update orders, track status changes
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up Google Analytics `npm install next-analytics`
- [ ] Create social media accounts for Instagram/Facebook sales
- [ ] Set up WhatsApp Business for customer service
- [ ] Enable email notifications for new orders
- [ ] Configure backup schedules in Supabase
- [ ] Add your business logo
- [ ] Update footer with legal info

## 8. Common Issues & Fixes

### "Supabase connection error"
```bash
# Check your environment variables exist:
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# If empty, restart dev server:
npm run dev
```

### "Build failed on Vercel"
1. Check build logs in Vercel dashboard
2. Common cause: Missing environment variable
3. Go to Settings → Environment Variables → verify all are set
4. Redeploy

### "Payment gateway returns 401"
- Check your API keys in `.env.local`
- Verify they match your Paymob/Fawry dashboard
- Ensure they're also in Vercel environment variables

### "Domain not resolving"
- DNS changes take 24-48 hours
- Check: https://dnschecker.org your-domain.com
- Verify nameservers in Cloudflare match Vercel's

## 9. Production Best Practices

### Security
```typescript
// src/lib/security.ts
import { supabase } from '@/lib/supabase/server';

// Always use RLS (Row Level Security) in database
// Enable auth in Supabase: Authentication → Policies

// Never expose service role key on client
if (typeof window !== 'undefined') {
  throw new Error('Service key should only be used server-side');
}
```

### Performance
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="Product"
  width={300}
  height={300}
  placeholder="blur"
  blurDataURL="..." 
/>

// Enable caching in next.config.js
const nextConfig = {
  images: {
    minimumCacheTTL: 31536000, // 1 year
  },
};
```

### Monitoring
```bash
npm install @vercel/analytics
npm install @vercel/speed-insights
```

```typescript
// src/app/layout.tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout() {
  return (
    <html>
      <body>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## 10. Scaling for Success

### As you grow:
1. **Database backups**: Supabase auto-backups daily
2. **CDN**: Vercel uses global CDN automatically
3. **Load balancing**: Handled by Vercel, no config needed
4. **Database optimization**: Add indexes on frequently queried columns

### Example: Add index for fast order lookups
```sql
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
```

## 11. Monthly Maintenance

- [ ] Review Vercel analytics — traffic & performance
- [ ] Check Supabase dashboard — storage usage
- [ ] Test payment gateway — process test transaction
- [ ] Review customer feedback — improve UX
- [ ] Update product inventory
- [ ] Back up order data manually if needed

---

## Support Resources

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs
- **Paymob**: https://paymob.com/en/acceptsolutions/e-commerce/
- **Cloudflare**: https://support.cloudflare.com

**Questions?** Check the main README.md or create an issue in GitHub.

---

**🎉 Congratulations! Your Egyptian e-commerce store is live!**
