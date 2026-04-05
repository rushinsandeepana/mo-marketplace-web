# MO Marketplace Web

React frontend for MO Marketplace — product listing, creation, variant selection and Quick Buy flow.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React + TypeScript | Frontend framework |
| Vite | Build tool |
| React Router DOM | Routing |
| React Hook Form | Form management |
| Zod | Form validation |
| Axios | HTTP client |
| Tailwind CSS | Styling |

---

## Prerequisites

| Tool | Version | How to check |
|------|---------|--------------|
| Node.js | v20+ | `node --version` |
| npm | v9+ | `npm --version` |
| Git | latest | `git --version` |

> Make sure backend is running before starting frontend

---

## Project Structure

```bash
mo-marketplace-web/
└── src/
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProductListPage.tsx
│   ├── ProductDetailPage.tsx
│   └── CreateProductPage.tsx
├── components/
│   ├── Navbar.tsx
│   ├── PrivateRoute.tsx
│   ├── VariantSelector.tsx
│   └── QuickBuy.tsx
│   └── CartDrawer.tsx
├── api/
│   ├── client.ts
│   ├── auth.api.ts
│   └── orders.api.ts
│   └── products.api.ts
├── store/
│   └── auth.store.ts
│   └── cart.store.ts
├── App.tsx
└── main.tsx
├── .env.example
└── README.md

---

## Setup — Step by Step

### Step 1 — Clone Repository
```bash
git clone https://github.com/rushinsandeepana/mo-marketplace-web.git
cd mo-marketplace-web
```

### Step 2 — Install Dependencies
```bash
npm install
```

### Step 3 — Setup Environment Variables
```bash
cp .env.example .env
```

Your `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

### Step 4 — Make Sure Backend is Running

Backend must be running at:
http://localhost:3000

Follow backend README to setup and run backend first.

### Step 5 — Run Frontend
```bash
npm run dev
```

Open browser:
http://localhost:5173

---

## Pages

| Page | URL | Access |
|------|-----|--------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Product List | `/` | Protected |
| Product Detail | `/products/:id` | Protected |
| Create Product | `/products/new` | Protected |

---

## UI Components

| Component | Description |
|----------|-------------|
| CartDrawer | Slide-out cart panel for viewing selected items and managing cart |

---

## Features

### Authentication
- Register with email and password
- Login and receive JWT token
- JWT stored in localStorage
- Auto redirect to login on token expiry
- Logout clears token and redirects

### Products
- View all products in responsive grid
- Create product with multiple variants
- View product detail with variant info
- In stock and out of stock badges

### Variants
- Select variant on product detail page
- Out of stock variants disabled
- Price override shown if available
- combination_key shown on each button

### Quick Buy

- User must select a product variant before adding to cart  
- "Add to Cart" is disabled until a variant is selected  
- Disabled if the selected variant is out of stock  
- Shows loading state while adding to cart  
- Displays success message after adding item  

---

### Cart & Order Flow

- Once a variant is selected, user can add it to the cart  
- Cart is displayed using a **CartDrawer** (slide-out panel)  
- Users can:
  - View selected items  
  - Update quantities  
  - Remove items  
- User can place order directly from the CartDrawer

### Edge Cases Handled
- Duplicate variant combination → error shown
- Out of stock variant → button disabled
- Invalid form input → validation errors shown
- Expired JWT → auto redirect to login
- Product not found → error message shown
- Empty product list → helpful message shown

---

## Available Scripts
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |

---

## Full Stack Setup

Run backend and frontend together.

### Terminal 1 — Start Database
```bash
docker start mo-db
```

### Terminal 2 — Start Backend
```bash
cd mo-marketplace-api
npm run start:dev
```

### Terminal 3 — Start Frontend
```bash
cd mo-marketplace-web
npm run dev
```

### Open Browser
http://localhost:5173

---

## Troubleshooting

### Cannot connect to backend
```bash
# Make sure backend is running
# Open http://localhost:3000 in browser

# Check VITE_API_URL in .env
VITE_API_URL=http://localhost:3000
```

### Login not working
```bash
# Make sure backend is running
# Test backend at http://localhost:3000/api
# Check browser console for errors
```

### Tailwind styles not working
```bash
# Check src/index.css has these lines
@tailwind base;
@tailwind components;
@tailwind utilities;

# Restart dev server
npm run dev
```

### Page shows blank
```bash
# Check browser console for errors
# Restart dev server
npm run dev
```

### Redirected to login on every page
```bash
# JWT token may be expired
# Login again to get new token
# Check localStorage in browser dev tools
```

---

## Assumptions and Decisions

- JWT stored in localStorage for simplicity
- All product routes are JWT protected
- Any logged in user can create and view products
- Quick Buy is simulated — no real orders API
- Tailwind CSS used for clean professional UI
- Zod used for frontend form validation
- Backend runs on port 3000
- Frontend runs on port 5173
