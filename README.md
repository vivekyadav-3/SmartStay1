# 🏢 KIIT SmartStay — Next-Gen Digital Hostel Management System

<div align="center">

[![Live Demo](https://img.shields.io/badge/Demo-smart--stay1.vercel.app-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://smart-stay1.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**A comprehensive, role-driven web application transforming hostel life at KIIT Deemed to be University.**  
*Paperless gate passes, live laundry tracking, digitized room complaints, warden broadcasts, and instant medical SOS.*

[🚀 View Live Application](https://smart-stay1.vercel.app) • [📖 Documentation](#-key-features) • [💻 Local Setup](#-getting-started)

</div>

---

## 📌 Overview

Hostel operations in large university campuses often rely on manual paper slips, physical registers, and fragmented notice boards. **KIIT SmartStay** digitizes and unifies the entire hostel ecosystem into a single real-time platform designed specifically for students, hostel wardens, head wardens, and security gate staff.

### 🌟 Key Highlights
- **100% Paperless Workflows**: End-to-end digital approval for library visits, day passes, and night outs.
- **Real-Time Facility Status**: Live occupancy monitoring for washing machines and shared amenities.
- **Instant Emergency Response**: Dedicated Medical SOS & Ambulance dispatch with automatic room locating.
- **Multi-Role Governance**: Role-switched views tailored for Students, Wardens, Head Wardens, and Security Gate Guards.

---

## ✨ Core Features

### 1. 🎫 Central Library Pass & Gate Pass System
- Apply for digital gate passes with purpose, departure time, and return curfew (e.g. 08:30 PM).
- Unique auto-generated pass codes (`GP-2026-XXXX`) with live status badges (`APPROVED`, `PENDING`, `REJECTED`).
- Biometric verification simulation (`HOSTEL IN-CAMPUS` vs. `OUTSIDE CAMPUS`).
- Wardens can batch-review and approve passes in 1-click.

### 2. 🧺 Live Washing Machine Tracker & Slot Booking
- Eliminates unnecessary trips down hostel stairs with floor-wise machine status (`VACANT` / `OCCUPIED`).
- 1-hour pre-booking reservation system to avoid conflicts in laundry rooms.

### 3. 📢 Digital Notice Board & Curfew Broadcasts
- Live broadcasts published by wardens directly accessible on student mobile and desktop views.
- Color-coded category tags for urgent curfew notices, maintenance downtimes, and campus fests.

### 4. 🔧 Student Complaints & Maintenance Tracking
- Categorized tickets (Electrical, Plumbing, Furniture, Cleanliness, Wi-Fi).
- Real-time resolution progress tracking from initial filing to warden sign-off.

### 5. 🍲 Daily Mess Food Review & Feedback
- Daily meal rating system (Breakfast, Lunch, Snacks, Dinner) with 5-star scoring.
- Transparent student satisfaction metrics and live reviews for hostel mess committees.

### 6. 🚨 Medical SOS & Ambulance Dispatch
- 1-click emergency modal accessible from any page.
- Instantly alerts reception and hostel security with the resident's exact hostel, room, and bed number.

### 7. 👥 Multi-Role Authorization & Dashboard Views
- **Student View**: Personalized resident profile, digital ID card, current passes, and personal requests.
- **Warden Control Room**: Real-time pass approval queue, active complaints dashboard, notice publisher, and student logs.
- **Head Warden Portal**: Campus-wide hostel statistics, occupancy metrics, and cross-hostel governance.
- **Security Gate Console**: Quick pass verification, entry/exit timestamp logging, and biometric checkouts.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | [Next.js 15 (App Router)](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/), Custom Modern KIIT Theme |
| **Backend & APIs** | Next.js Server Actions, Route Handlers |
| **Database & ORM**| [Prisma ORM](https://www.prisma.io/), SQLite (`dev.db` with serverless replication support) |
| **Deployment** | [Vercel](https://smart-stay1.vercel.app) |

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17.0 or higher recommended)
- `npm` or `pnpm` or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/vivekyadav-3/SmartStay1.git
cd SmartStay1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup the Database
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations / push schema
npx prisma db push
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```text
hostelapp/
├── prisma/
│   ├── schema.prisma            # Prisma schema (User, StudentProfile, GatePass, Complaint, etc.)
│   ├── dev.db                   # Local SQLite database
│   └── seed.ts                  # Database seeding scripts
├── public/                      # Static assets & icons
├── src/
│   ├── app/
│   │   ├── actions/             # Next.js Server Actions (Gate passes, Laundry, Complaints, Auth)
│   │   ├── dashboard/           # Role-based dashboard views & sub-pages
│   │   │   ├── announcements/   # Notice board
│   │   │   ├── complaints/      # Room maintenance tickets
│   │   │   ├── feedback/        # Resident feedback & ratings
│   │   │   ├── gate-pass/       # Digital pass creation & logs
│   │   │   ├── laundry/         # Washing machine tracker
│   │   │   ├── warden/          # Warden administrative control room
│   │   │   └── security-gate/   # Turnstile & security gate console
│   │   ├── login/               # Student & staff institutional login
│   │   ├── layout.tsx           # Global app layout & fonts
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── dashboard/           # Dashboard UI modules (Student header, Sidebar, Role switcher)
│   │   └── ui/                  # Reusable UI primitives (Buttons, Cards, Dialogs, Badges)
│   └── lib/
│       ├── db.ts                # Prisma database singleton
│       └── utils.ts             # Utility helper functions
└── package.json
```

---

## 👨‍💻 Project Lead & Author

**Vivek Yadav**  
*KIIT Deemed to be University, Bhubaneswar*  
Department of Computer Science & Engineering  
- **GitHub**: [@vivekyadav-3](https://github.com/vivekyadav-3)  
- **Live Project**: [smart-stay1.vercel.app](https://smart-stay1.vercel.app)

---

## 📄 License

This project is developed as an academic capstone and institutional innovation prototype for **KIIT Deemed to be University**. All rights reserved.
