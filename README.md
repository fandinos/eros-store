# 🧸 ToyLand — Next.js Ecommerce Store

A complete, production-ready toy store built with Next.js + Stripe payments.

---

## 📋 What's Included

- ✅ Homepage with hero, categories & featured products
- ✅ Shop page with category filtering & sorting
- ✅ Product detail pages
- ✅ Shopping cart (slide-out drawer, persists across sessions)
- ✅ Stripe Checkout integration (real payments!)
- ✅ Order success page
- ✅ Mobile responsive design
- ✅ Fun & playful toy store theme

---

## 🚀 Setup in 5 Steps

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Set up Stripe
1. Create a free account at https://stripe.com
2. Go to Dashboard → Developers → API Keys
3. Copy your **Publishable key** and **Secret key**

### Step 3 — Create your .env.local file
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` and paste your Stripe keys:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 4 — Add your products
Edit `lib/products.js` — replace the example products with your real ones.
Each product needs:
- `id` — unique string
- `name` — product name
- `description` — short description
- `price` — price in CENTS (e.g. $34.99 = 3499)
- `image` — image URL (or upload to /public and use `/your-image.jpg`)
- `category` — category name
- `ageRange` — age recommendation
- `inStock` — true or false

### Step 5 — Run locally
```bash
npm run dev
```
Open http://localhost:3000 🎉

---

## 💳 Testing Payments

Use Stripe test card numbers (these don't charge real money):
- ✅ Success: `4242 4242 4242 4242`
- ❌ Decline: `4000 0000 0000 0002`
- Use any future expiry date and any 3-digit CVC

---

## 🌐 Deploying to Vercel (Free)

1. Push your code to GitHub
2. Go to https://vercel.com → "New Project" → import your repo
3. In Vercel project settings → **Environment Variables**, add:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_SITE_URL` → set to your Vercel URL (e.g. `https://toystore.vercel.app`)
4. Deploy! ✅

### After deployment:
- Update `NEXT_PUBLIC_SITE_URL` to your live domain
- Switch Stripe keys from `pk_test_` → `pk_live_` when you're ready for real sales

---

## 📁 File Structure

```
toystore/
├── pages/
│   ├── index.js              # Homepage
│   ├── shop.js               # Shop / catalog
│   ├── checkout.js           # Checkout page
│   ├── success.js            # Order confirmation
│   ├── product/[id].js       # Individual product page
│   └── api/
│       └── create-checkout-session.js  # Stripe API
├── components/
│   ├── Navbar.js             # Navigation bar
│   ├── Footer.js             # Footer
│   ├── CartDrawer.js         # Slide-out cart
│   └── ProductCard.js        # Product card component
├── lib/
│   ├── products.js           # YOUR PRODUCT DATA — edit this!
│   └── CartContext.js        # Shopping cart state
├── styles/
│   └── globals.css           # Global styles & theme
└── .env.local.example        # Environment variables template
```

---

## 🔧 Customization

### Change store name
Search and replace "ToyLand" across all files.

### Change colors
Edit the CSS variables at the top of `styles/globals.css`:
```css
:root {
  --yellow: #FFD93D;
  --orange: #FF6B35;
  --pink: #FF4D8D;
  --purple: #7B2FBE;
  ...
}
```

### Add more pages
- Shipping policy, About page, Contact form — just add new files to `/pages/`

---

## 🆘 Need Help?

- Stripe docs: https://stripe.com/docs
- Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs
