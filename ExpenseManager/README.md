# Expense Manager Pro

A complete multi-page personal finance web application built using HTML, CSS, vanilla JavaScript, and Chart.js, with persistent local state powered by `localStorage`.

## Features
- **Transactions System**: Add income and expense transactions, auto-calculate total income, total expenses, and net balance across pages.
- **Search & Filters**: Live search by description/category with quick filter buttons (Show All, Income, Expenses).
- **Budgeting & Savings**: Set overall monthly budgets and category-specific spending limits with dynamic warning indicators when exceeded.
- **Calendar & Loan Management**: Track loans given and taken, due dates, repayment status, and view calendar daily event breakdowns with a 1st-of-month alert modal.
- **Analytics & Insights**: Dynamic Chart.js category-wise spending chart and AI-style metrics (highest expense, lowest expense, most frequent category).
- **Authentication**: Local storage-based user signup, login, and guest mode.

## Structure
- `index.html` - Dashboard overview with balance and quick-add form
- `transactions.html` - Full transaction history with search & filter
- `insights.html` - Visual analytics and Chart.js spending chart
- `budget.html` - Budget tracker & savings goals
- `calendar.html` - Calendar event & loan management system
- `signup.html` / `login.html` - User authentication flow
- `style.css` - Application styling and responsive UI
- `script.js` - Unified state management and interactive logic
