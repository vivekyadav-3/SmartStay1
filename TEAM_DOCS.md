# ?? KIIT SmartStay — Team Documentation

> **Project:** KIIT SmartStay  
> **Team Lead:** Vivek Yadav  
> **Team:** Vivek · Subhham · Dev · Shreyan · Sakib  
> **Current Phase:** Prototype 1 of 4  
> **Stack:** Next.js 15 · TypeScript · Prisma ORM · SQLite · Tailwind CSS  

---

## ?? What Is This Project?

**KIIT SmartStay** is a digital hostel management system for KIIT University students.

Today, students submit paper gate passes, complaints go to a notice board, laundry is tracked in registers.
**SmartStay replaces all of this with one web application.**

---

## ?? Prototype 1 — What We Are Showing NOW

> **Rule: Prototype 1 proves ONE complete workflow end to end.**

    Student fills Gate Pass ? Warden approves it ? Status updates in Database

### ? What is built

| Screen | Role | What it does |
|---|---|---|
| Student Dashboard | Student | Shows name, hostel, room, current gate pass status |
| Apply Gate Pass | Student | Fills destination, purpose, return time ? saves to DB |
| Student Profile | Student | ID card with roll number, branch, hostel details |
| Warden Approval Panel | Warden | Sees all PENDING passes, clicks Approve |
| DB Inspector | Dev/Demo | Live view of SQLite database tables |

---

## ??? Tech Stack

| Technology | What is it | Why we use it |
|---|---|---|
| Next.js 15 | React framework | Full-stack in one codebase |
| TypeScript | JavaScript with types | Catches bugs before running |
| Prisma ORM | Database toolkit | TypeScript to talk to DB |
| SQLite | Local database | Simple, no server needed |
| Tailwind CSS | CSS framework | Fast styling |
| Server Actions | Next.js feature | Backend functions from browser |

---

## ??? Database Structure

    User
     +-- id, name, email, role (STUDENT / WARDEN / SECURITY)
     +--? StudentProfile
     ¦     +-- rollNumber, branch, semester, year
     ¦     +--? Bed ? Room ? Hostel
     +--? GatePass
           +-- passCode (GP-2026-XXXX)
           +-- userId (the student)
           +-- destination, purpose
           +-- returnTime (must be before 8:15 PM)
           +-- status (PENDING ? APPROVED ? REJECTED)
           +-- approvedById (warden FK — NULL until approved)

The key concept: approvedById is a FOREIGN KEY pointing to User.
When NULL ? PENDING. When filled ? APPROVED. This is what the teacher evaluates.

---

## ?? Gate Pass Workflow

    STUDENT               DATABASE                  WARDEN
       ¦                     ¦                         ¦
       ¦-- Fill form --------?¦                         ¦
       ¦                     ¦ INSERT GatePass          ¦
       ¦                     ¦ status = PENDING         ¦
       ¦                     ¦ approvedById = NULL      ¦
       ¦?-- PENDING shown ---¦                         ¦
       ¦                     ¦?-- Warden opens panel --¦
       ¦                     ¦?-- Warden clicks Approve¦
       ¦                     ¦ UPDATE GatePass          ¦
       ¦                     ¦ status = APPROVED        ¦
       ¦                     ¦ approvedById = warden.id ¦
       ¦?-- APPROVED shown --¦                         ¦

---

## ?? Team Roles & Responsibilities

### ?? Vivek Yadav — Lead Developer
**Done in P1:** DB schema, server actions, role auth, demo seeding, DB inspector
**Future:** Architecture decisions, code review, integration, deployment

### ?? Subhham — Frontend Developer
**P1 Task:** Study sidebar + layout (src/components/dashboard/sidebar.tsx)
**P2 Module: Complaints System**
- Student files complaint (title, description, category)
- Warden sees all complaints, marks resolved
- Files: src/app/dashboard/complaints/page.tsx + src/app/actions/complaints.ts

### ?? Dev — Database & Backend Developer
**P1 Task:** Study schema.prisma + understand User ? GatePass ? approvedById
**P2 Module: Mess Menu + Food Reviews**
- Weekly menu (Mon–Sun, Breakfast/Lunch/Dinner)
- Students rate meals (1–5 stars)
- Files: src/app/dashboard/mess/page.tsx + src/app/actions/mess.ts

### ?? Shreyan — UI/UX Developer
**P1 Task:** Study existing dashboard pages + Tailwind classes
**P2 Module: Announcements**
- Warden posts announcements
- Students see list, pinned at top
- Files: src/app/dashboard/announcements/page.tsx + src/app/actions/announcements.ts

### ?? Sakib — Integration & Testing
**P1 Task:** Run the full demo flow yourself end to end, report bugs
**P2 Module: Laundry Booking**
- Student books a slot (date + time)
- Shows PENDING / COLLECTED status
- Files: src/app/dashboard/laundry/page.tsx + src/app/actions/laundry.ts

---

## ??? Full Project Roadmap

    PROTOTYPE 1 — NOW ?
    +-- Gate Pass workflow (Student ? Warden ? DB)
    +-- Student Dashboard + Profile
    +-- DB Inspector

    PROTOTYPE 2 — NEXT SPRINT
    +-- Complaints System       ? Subhham
    +-- Mess Menu + Food Review ? Dev
    +-- Announcements           ? Shreyan
    +-- Laundry Booking         ? Sakib

    PROTOTYPE 3 — LATER
    +-- Security Gate scan (entry/exit logging)
    +-- Hostel Fee view
    +-- Real authentication (email/password login)

    PROTOTYPE 4 — FINAL
    +-- Admin panel (all hostels overview)
    +-- Reports (export gate pass history)
    +-- Notifications (email alerts)
    +-- Cloud deployment

---

## ??? How to Run

    npm install
    npx prisma generate
    npx prisma db push
    npm run seed
    npm run dev

    Open: http://localhost:3000
    DB Inspector: http://localhost:3000/dashboard/db-inspect

---

## ?? Demo Script

### Opening (30 sec)
"We are building KIIT SmartStay — a digital hostel management system.
Today we show Prototype 1: a gate pass going from student to warden, backed by a real database."

### Step 1: Student Dashboard (30 sec)
"This is Vivek's dashboard. Name, hostel, room, current gate pass status PENDING."

### Step 2: Apply Gate Pass (1 min)
"Student fills destination, purpose, return time under 8:15 PM.
Submit ? server action runs ? Prisma INSERT into GatePass ? status = PENDING, approvedById = NULL."
Show DB inspector to confirm new row.

### Step 3: Warden Approves (45 sec)
"Switch to Warden view — Prof. S. K. Mohapatra sees PENDING passes.
He clicks Approve ? UPDATE GatePass SET status = APPROVED, approvedById = warden.id.
This is the foreign key relationship. The gate pass now knows which warden approved it."

### Step 4: Student sees APPROVED (30 sec)
"Back to Vivek's dashboard — status changed to APPROVED. No paper. The database is the source of truth."

### DB Inspector (30 sec)
"Our DB Inspector shows the live SQLite database.
GatePass table: passCode, student ID, destination, status APPROVED, approvedById now has the warden's ID.
Database relations working."

### Closing (20 sec)
"In Prototype 2, each team member adds their own module following the same pattern:
a form, a server action, a database table. Thank you."

---

## ????? Demo Personas in Database

| Name | Role | Roll No | Hostel |
|---|---|---|---|
| Vivek Yadav | Student | 22051934 | King's Palace 7, Room 412 |
| Subhham | Student | 22051935 | King's Palace 7, Room 412 |
| Dev | Student | 22051936 | King's Palace 7, Room 413 |
| Shreyan | Student | 22051937 | King's Palace 7, Room 413 |
| Sakib | Student | 22051938 | King's Palace 7, Room 414 |
| Prof. S. K. Mohapatra | Warden | — | — |
| Havildar R. K. Swain | Security | — | — |

---

## ?? Rules — Do NOT Break

1. Never edit schema.prisma without telling Vivek
2. Always run npx prisma db push after editing schema
3. Always run npm run seed after db push
4. Do not delete prisma/dev.db
5. Return time on gate passes must be before 8:15 PM

---

*KIIT SmartStay — Prototype 1 | Team: Vivek · Subhham · Dev · Shreyan · Sakib*
