# FinTrack — Finance Dashboard

A clean, interactive finance dashboard built with React + Vite.

## Tech Stack

- **React 18** + **Vite** — fast dev server and build
- **Recharts** — Area, Bar, and Pie charts
- **Zustand** — lightweight global state management
- **Lucide React** — icon library
- **CSS Variables** — custom design system (no Tailwind, no MUI)

## Features

### Dashboard Overview
- Summary cards: Total Balance, Income, Expenses, Transaction count
- Area chart: Income vs Expenses trend (6 months)
- Pie chart: Spending by category
- Bar chart: Monthly comparison
- Recent transactions table

### Transactions
- Full transaction list with date, description, category, type, amount
- Search by description or category
- Filter by type (income/expense) and category
- Sort by date or amount (asc/desc)
- CSV export

### Role-Based UI
- **Viewer** — read-only access, no edit/delete/add buttons
- **Admin** — can add, edit, and delete transactions
- Switch roles via the sidebar dropdown or topbar badge

### Insights
- Savings rate with progress bar
- Highest spending category
- Best savings month
- Highest expense month
- Average monthly expense
- Month-over-month expense comparison
- Full category breakdown table with visual bars

### UX Extras
- Dark mode toggle (persisted in localStorage)
- All data persisted in localStorage
- Responsive layout (sidebar collapses on mobile with hamburger menu)
- Smooth animations: page fade-in, card hover lift, button hover, modal slide-up
- Empty state handling for no data / no filter results

## Getting Started

```bash
cd finance-dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
├── data/
│   └── mockData.js          # Static transactions, monthly & category data
├── store/
│   └── useStore.js          # Zustand store (role, dark mode, transactions, filters)
├── components/
│   ├── Layout.jsx            # Sidebar + topbar shell
│   ├── SummaryCard.jsx       # Reusable stat card
│   ├── TransactionModal.jsx  # Add/edit transaction modal (admin only)
│   └── charts/
│       ├── BalanceTrendChart.jsx
│       ├── SpendingPieChart.jsx
│       └── MonthlyBarChart.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   └── Insights.jsx
├── App.jsx
├── main.jsx
└── index.css                 # All styles via CSS custom properties
```

## Notes

- No backend is there — all data is static/mock
- Role switching is frontend-only for demonstration purposes
- Data added by admin is persisted via localStorage across sessions
