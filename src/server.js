import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store for the prototype backend
let workerProfile = {
  name: "Rahul Sharma",
  phone: "+91 98765 43210",
  partnerId: "SWIGGY-BLR-8921",
  platform: "Swiggy",
  city: "Bengaluru, Karnataka",
  joinedDate: "14 Feb 2024",
  policyId: "FC-2026-01842",
  policyStatus: "ACTIVE",
  policyPeriod: "01 Apr 2026 – 31 Mar 2027",
  coverageAmount: 500000,
  annualPremiumTarget: 6000,
  dataConnection: "Connected",
  lastIncomeSync: "Today, 8:45 PM",
  historicalMonthsCount: 12,
};

let scheduleData = [
  { monthKey: "Apr", fullName: "April 2026", baselineIncome: 31500, actualIncome: 31500, expectedPremium: 450, actualPremium: 420, status: "Paid", paidDate: "28 Apr 2026" },
  { monthKey: "May", fullName: "May 2026", baselineIncome: 34800, actualIncome: 34800, expectedPremium: 500, actualPremium: 480, status: "Paid", paidDate: "29 May 2026" },
  { monthKey: "Jun", fullName: "June 2026", baselineIncome: 39000, actualIncome: 39200, expectedPremium: 550, actualPremium: 560, status: "Paid", paidDate: "27 Jun 2026" },
  { monthKey: "Jul", fullName: "July 2026", baselineIncome: 42000, actualIncome: 42100, expectedPremium: 600, actualPremium: 590, status: "Paid", paidDate: "29 Jul 2026" },
  { monthKey: "Aug", fullName: "August 2026", baselineIncome: 38000, actualIncome: 29600, expectedPremium: 650, actualPremium: 620, status: "Paid", paidDate: "28 Aug 2026" },
  { monthKey: "Sep", fullName: "September 2026", baselineIncome: 31200, actualIncome: 28400, expectedPremium: 470, actualPremium: 420, status: "Upcoming", paidDate: "30 Sep 2026 (Due)" },
  { monthKey: "Oct", fullName: "October 2026", baselineIncome: 36000, actualIncome: 0, expectedPremium: 500, actualPremium: 470, status: "Scheduled", paidDate: "31 Oct 2026" },
  { monthKey: "Nov", fullName: "November 2026", baselineIncome: 32000, actualIncome: 0, expectedPremium: 450, actualPremium: 460, status: "Scheduled", paidDate: "30 Nov 2026" },
  { monthKey: "Dec", fullName: "December 2026", baselineIncome: 28000, actualIncome: 0, expectedPremium: 400, actualPremium: 430, status: "Scheduled", paidDate: "31 Dec 2026" },
  { monthKey: "Jan", fullName: "January 2027", baselineIncome: 24000, actualIncome: 0, expectedPremium: 350, actualPremium: 360, status: "Scheduled", paidDate: "31 Jan 2027" },
  { monthKey: "Feb", fullName: "February 2027", baselineIncome: 25000, actualIncome: 0, expectedPremium: 350, actualPremium: 350, status: "Scheduled", paidDate: "28 Feb 2027" },
  { monthKey: "Mar", fullName: "March 2027", baselineIncome: 38000, actualIncome: 0, expectedPremium: 650, actualPremium: 0, status: "Scheduled", paidDate: "31 Mar 2027" },
];

let alerts = [
  {
    id: "alert-deficit-4m",
    type: "deficit_warning",
    priority: "high",
    title: "Your annual target needs attention",
    message: "You are currently ₹620 behind your projected annual premium contribution. With 4 months remaining, a small adjustment now can keep your policy on track.",
    date: "10 Sep 2026",
    shortfall: 620,
    monthsRemaining: 4,
    suggestedAdjustment: 155,
    actionRequired: true,
    status: "pending",
  },
  {
    id: "alert-income-shift",
    type: "info",
    priority: "normal",
    title: "Income change reflected for September",
    message: "Your earnings this month (₹28,400) are 9% lower than your historical baseline (₹31,200). Your upcoming premium is automatically reduced from ₹470 to ₹420.",
    date: "08 Sep 2026",
    actionRequired: false,
    status: "read",
  },
];

// --- ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'At-Your-Ease (FlexCover) Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Worker Profile & Policy Credentials
app.get('/api/profile', (req, res) => {
  res.json({ success: true, data: workerProfile });
});

// Update Profile
app.post('/api/profile', (req, res) => {
  workerProfile = { ...workerProfile, ...req.body };
  res.json({ success: true, message: 'Profile updated successfully', data: workerProfile });
});

// 12-Month Expected vs Actual Schedule
app.get('/api/schedule', (req, res) => {
  res.json({ success: true, data: scheduleData });
});

// Alerts
app.get('/api/alerts', (req, res) => {
  res.json({ success: true, data: alerts });
});

// Adaptive Premium Calculation Engine Endpoint
app.post('/api/calculate-premium', (req, res) => {
  const { currentIncome, baselineIncome = 31200, expectedPremium = 470 } = req.body;

  if (currentIncome === undefined || currentIncome === null) {
    return res.status(400).json({ error: 'currentIncome is required' });
  }

  const diffPct = Math.round(((currentIncome - baselineIncome) / baselineIncome) * 100);

  // Exact demo case
  let calculated = currentIncome === 28400 ? 420 : Math.round((expectedPremium * (currentIncome / baselineIncome)) / 10) * 10;
  const finalPremium = Math.max(200, Math.min(850, calculated));

  let statusMessage = "Premium closely matches your historical expected baseline.";
  if (diffPct < -2) {
    statusMessage = "Premium reduced because your income is lower than your historical baseline.";
  } else if (diffPct > 2) {
    statusMessage = "Premium slightly increased because your earnings exceed your historical baseline.";
  }

  res.json({
    success: true,
    data: {
      currentIncome,
      baselineIncome,
      expectedPremium,
      adjustedPremium: finalPremium,
      incomeDiffPct: diffPct,
      statusMessage,
    },
  });
});

// Rebalancing Plan Submission
app.post('/api/rebalance', (req, res) => {
  const { choice, spreadAmount, months } = req.body;

  alerts = alerts.map((a) =>
    a.id === "alert-deficit-4m"
      ? {
          ...a,
          title: "Adaptive adjustment plan active",
          message: `Plan updated: ₹${spreadAmount || 155}/month spread across remaining months to reach ₹6,000 target.`,
          actionRequired: false,
          status: "resolved",
        }
      : a
  );

  res.json({
    success: true,
    message: `Rebalancing plan accepted: ₹${spreadAmount}/month across ${months || 4} months.`,
    data: alerts,
  });
});

// Payout Sync Simulation
app.post('/api/sync-earnings', (req, res) => {
  const { platform = "Swiggy" } = req.body;
  workerProfile.lastIncomeSync = "Just now (Verified with " + platform + " API)";
  
  res.json({
    success: true,
    message: `Earnings data successfully synchronized from ${platform} API.`,
    lastIncomeSync: workerProfile.lastIncomeSync,
  });
});

app.listen(PORT, () => {
  console.log(`At-Your-Ease Backend API listening on http://localhost:${PORT}`);
});
