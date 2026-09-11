# At-Your-Ease 

An income-adaptive financial and insurance platform designed specifically for gig workers (Swiggy, Zomato, Uber, Rapido, Amazon delivery partners) whose earnings fluctuate monthly.

The annual insurance target is fixed (e.g. ₹6,000 / year for ₹5,00,000 coverage), while monthly premiums adapt up or down according to actual gig earnings compared against a 12-month historical seasonal baseline.

---

## 📁 Repository Structure

```
build-and-bank/
├── frontend/             # React 18 + Vite + Tailwind CSS + Recharts prototype
│   ├── src/
│   │   ├── components/   # Layout, Sidebar, TopHeader, MobileNav
│   │   ├── context/      # PolicyContext (calculation engine & state)
│   │   ├── data/         # 12-month schedule & mock earnings
│   │   ├── pages/        # 7 full pages
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/              # Node.js + Express REST API
│   ├── src/
│   │   └── server.js     # Profile, Schedule, Calculation & Rebalancing APIs
│   ├── package.json
│   └── .env.example
│
└── package.json          # Unified monorepo runner scripts
```

---

## 🚀 Getting Started

### 1. Run the Frontend
```bash
# From the repository root
npm run dev:frontend

# Or directly inside the frontend directory
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Run the Backend API
```bash
# From the repository root
npm run dev:backend

# Or directly inside the backend directory
cd backend
npm start
```
The REST API will run at [http://localhost:5000](http://localhost:5000).

### 3. Production Build
```bash
npm run build
```

---

## 🎨 Visual Identity & Theme
- **Dominant Canvas**: Warm Off-White (`#FFF8EC`)
- **Card Surfaces**: Clean White (`#FFFFFF`) with borders (`#E7E1D7`)
- **Headers & Navigation**: Deep Blue (`#214B9D`)
- **Actions & Highlights**: Primary Orange (`#FF711F`)
- **Charts & Baselines**: Light Blue (`#629BEA`)
- **On-Track / Paid**: Green (`#2E8B67`)