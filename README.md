# Demargo Interior Contractors — Employee Record Management System

A full-featured Employee Record Management System (ERMS) built with React and Tailwind CSS.

---

## Prerequisites

Make sure you have the following installed on your laptop:

- **Node.js** (v16 or higher) → https://nodejs.org/en/download
- **npm** (comes with Node.js automatically)

To check if they're installed, open a terminal and run:
```
node -v
npm -v
```

---

## Setup & Run (Step by Step)

### 1. Open a terminal / command prompt

- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Open `Terminal` from Applications
- **Linux**: Open your terminal

### 2. Navigate to this project folder

```bash
cd path/to/demargo-erms
```
For example, if you downloaded it to your Desktop:
```bash
cd Desktop/demargo-erms
```

### 3. Install dependencies (first time only)

```bash
npm install
```
This will download all required packages. It may take 1–3 minutes.

### 4. Start the app

```bash
npm start
```

The app will automatically open in your browser at:
**http://localhost:3000**

---

## Features

- **Dashboard** — Live stats (total, full-time, contract, probation)
- **Employee Grid & List View** — Switch between card grid and table list
- **Search & Filter** — Filter by name, ID, role, department, or status
- **Add Employee** — Full form with validation
- **Edit Employee** — Update any employee record
- **Delete Employee** — With confirmation dialog
- **Employee Detail Panel** — View full profile including next-of-kin
- **Analytics Tab** — Department headcount charts, SSNIT coverage tracker
- **Export CSV** — Download all (or filtered) employee data as a spreadsheet

---

## Tech Stack

- React 18
- Tailwind CSS
- Google Fonts (Playfair Display + DM Sans)
- No database — all data is stored in memory (page refresh resets to default)

---

## Notes

- All 61 employees from the original records are pre-loaded
- Changes made during a session are not saved to disk (no backend)
- To persist data across sessions, a backend/database would need to be added

---

## Support

For issues, contact your system administrator or developer.
