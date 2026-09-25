# 🎤 KIIT SmartStay — Demo Speaking Script
### Who Says What · Prototype 1 Presentation

> **Total time: ~8–10 minutes**  
> One person speaks at a time. One person controls the mouse.  
> Practice this at least once before Friday.

---

## 🗺️ ORDER OF SPEAKING

```
1. VIVEK       → Introduction + Project Overview         (2 min)
2. SUSHOBHAN   → UI Walkthrough — Student Side           (1.5 min)
3. DEV         → Database Explanation                    (2 min)
4. SHREYAN     → Warden Flow + Approval Demo             (1.5 min)
5. SAKIB       → Testing Story + Future Scope            (1 min)
```

---
---

# 👤 1. VIVEK — Project Lead
### ⏱️ Your time: ~2 minutes
### 🖱️ Screen: Start on the Landing Page (localhost:3000)

---

### What to say — Word for word:

> **"Good [morning/afternoon] everyone.**
>
> My name is Vivek Yadav, and I am the team lead for this project.
>
> We are building **KIIT SmartStay** — a digital hostel management system for KIIT students.
>
> Right now, if you are a hostel student and you want to go outside, you have to:
> - Go find the warden physically
> - Fill a paper gate pass
> - Get a signature
> - And hope the security guard remembers your face
>
> This process has zero digital record. If the warden is not available, you wait. If the paper is lost, there is no proof.
>
> **SmartStay solves this.**

*(pause for 2 seconds)*

> Our system has three roles:
> - A **Student** who applies for a gate pass
> - A **Warden** who approves or rejects it
> - A **Security Guard** who will verify it at the gate
>
> For Prototype 1, we are proving **one complete workflow**: Student applies a gate pass, it goes into the database as PENDING, the Warden sees it and approves it, and the student's dashboard updates in real time.
>
> The database stores everything — who applied, when, which warden approved, and at what time.
>
> I will now hand over to Sushobhan who will walk you through the student interface."

---

### 💡 Tips for Vivek:
- Speak slowly. You know this project — your team doesn't need you to rush.
- When you say "three roles" — hold up three fingers.
- Don't look at the screen while speaking. Face the teacher.

---
---

# 👤 2. SUSHOBHAN — Frontend Developer
### ⏱️ Your time: ~1.5 minutes
### 🖱️ Screen: Student Dashboard (localhost:3000/dashboard)

---

### What to say — Word for word:

> **"Thank you Vivek.**
>
> My name is Sushobhan. I worked on the student-facing interface.
>
> This is the Student Dashboard.
>
> *(point to the name card)*
> You can see the student's name — **Vivek Yadav**, his roll number, his branch, and his hostel assignment: **King's Palace 7, Room 412**.
>
> This information is not hardcoded. It is fetched live from the database every time the page loads.
>
> *(point to the Gate Pass status card)*
> Below that, you can see the current gate pass status — it says **PENDING**. This means the student has already applied for a pass and is waiting for warden approval.
>
> *(point to the Apply button)*
> And here is the Apply for Gate Pass button.
>
> The design is intentionally simple. A student should be able to understand their hostel status in under 5 seconds of looking at this page.
>
> *(navigate to Profile page)*
> If I click Profile — you can see the student's complete ID card: roll number, branch, semester, hostel block and room number. All of this comes from a linked database record called **StudentProfile**.
>
> I will now hand over to Dev who will explain the database behind all of this."

---

### 💡 Tips for Sushobhan:
- Use the mouse to point to what you are talking about — don't just say it, show it.
- Keep your voice confident. You built this UI. Own it.
- If someone asks "why is it dark themed?" — answer: "Modern web apps use dark themes for better readability and reduced eye strain, especially for students using this at night."

---
---

# 👤 3. DEV — Database & Backend Developer
### ⏱️ Your time: ~2 minutes
### 🖱️ Screen: DB Inspector (localhost:3000/dashboard/db-inspect)

---

### What to say — Word for word:

> **"Thank you Sushobhan.**
>
> My name is Dev. I worked on the database layer of the project.
>
> What you are looking at now is our **DB Inspector** — a custom page we built to show the live SQLite database in the browser.
>
> We use **SQLite** as our database — it is a lightweight, file-based database that is perfect for prototyping. All data is stored in a single file called `dev.db`.
>
> We use **Prisma ORM** to talk to the database. ORM stands for Object Relational Mapper — it means instead of writing raw SQL like `SELECT * FROM users`, we write TypeScript code, and Prisma converts it to SQL automatically.

*(scroll to the User table)*

> This is the **User table**. Every person in the system — students, wardens, security guards — is stored here with a unique ID, name, email, and role.
>
> *(scroll to GatePass table)*
>
> This is the **GatePass table**. Look at these columns carefully:
> - `passCode` — a unique ID like GP-2026-XXXX given to every gate pass
> - `userId` — this is a **foreign key** pointing to the User table. It tells us which student owns this pass.
> - `status` — currently shows PENDING
> - `approvedById` — this is **NULL** right now.
>
> NULL means nobody has approved it yet.
>
> When the warden approves — this `approvedById` column will be filled with the warden's user ID.
>
> This is the **foreign key relationship** — the gate pass is permanently linked to the warden who approved it. You can always trace back who approved what, and when.
>
> This is real database design — not a mock. Every action on the UI writes to this database in real time.
>
> I will now hand over to Shreyan who will demonstrate the warden approval."

---

### 💡 Tips for Dev:
- **Explain foreign key like this if teacher asks**: "A foreign key is a column in one table that stores the ID of a row in another table. It creates a link between the two tables. In our case, the GatePass table stores the warden's ID — so we always know who approved which pass."
- Point to the actual values on screen. Don't just describe them in the air.
- If the DB Inspector is slow — say "We are running on a local SQLite file, in production this would be a cloud database like PostgreSQL."

---
---

# 👤 4. SHREYAN — UI/UX Developer
### ⏱️ Your time: ~1.5 minutes
### 🖱️ Screen: Apply Gate Pass form, then switch to Warden view

---

### What to say — Word for word:

> **"Thank you Dev.**
>
> My name is Shreyan. I will now show the complete gate pass workflow live.
>
> *(navigate to Apply Gate Pass)*
>
> This is the Apply Gate Pass page. The student fills three things:
> - **Destination** — where they are going
> - **Purpose** — why they are going
> - **Return time** — when they will be back
>
> One important rule we enforced in code: **the return time cannot be after 8:15 PM**. This is because the hostel curfew is 8:30 PM. We gave a 15-minute buffer for the student to return. If the student tries to enter a time after 8:15, the system rejects it.
>
> *(fill the form: destination = "City Center Mall", purpose = "Personal errand", return = 7:30 PM)*
>
> I submit this. *(click submit)*
>
> The form calls a **Server Action** — a backend function that runs on the server. It validates the data and calls Prisma to insert a new GatePass record into the database.
>
> *(switch to Warden view using the Demo Role switcher)*
>
> Now I am Prof. S. K. Mohapatra — the warden. This is the Warden Approval Panel.
>
> I can see the gate pass that was just submitted. It shows the student name, destination, purpose, and return time — all from the database.
>
> *(click Approve)*
>
> I click Approve. The system runs `UPDATE GatePass SET status = APPROVED, approvedById = [warden ID]`.
>
> *(switch back to Student view)*
>
> Back on the student's dashboard — the status now shows **APPROVED**. No paper. No phone call. The database updated and the dashboard reflects it instantly.
>
> I will now hand over to Sakib for the final part."

---

### 💡 Tips for Shreyan:
- Do a practice run the night before so you know exactly which buttons to click.
- Speak the action as you do it: "I am clicking submit now… I am switching to warden view now…"
- If you accidentally click the wrong thing — don't panic. Say "Let me go back" and continue.

---
---

# 👤 5. SAKIB — Integration & Testing
### ⏱️ Your time: ~1 minute
### 🖱️ Screen: DB Inspector — show the updated GatePass row

---

### What to say — Word for word:

> **"Thank you Shreyan.**
>
> My name is Sakib. My role is integration and testing — making sure all the pieces work together correctly.
>
> *(navigate to DB Inspector, scroll to GatePass table)*
>
> What you can see here is the final proof. This is the GatePass table after Shreyan's demo.
>
> Look at the row we just created:
> - `status` → **APPROVED** — changed from PENDING
> - `approvedById` → now has a value — the warden's user ID
>
> This single row tells the complete story. One student applied. One warden approved. And the database has a permanent, traceable record.
>
> Now I want to talk about what comes next.
>
> **For Prototype 2**, each team member is building their own module:
> - Sushobhan builds the **Complaints System**
> - Dev builds the **Mess Menu and Food Reviews**
> - Shreyan builds the **Announcements Board**
> - I will build the **Laundry Booking System**
>
> Every module follows the same pattern we just showed you: a form, a server action, a database table, and a status that updates in real time.
>
> **The stack is: Next.js 15, TypeScript, Prisma ORM, and SQLite.**
>
> Our final Prototype 4 will have cloud deployment, real authentication, and a full admin panel.
>
> Thank you all for your time."

---

### 💡 Tips for Sakib:
- End strong. The last person people hear is the one they remember.
- When you list the Prototype 2 modules, point to each person as you say their name.
- If teacher asks "why SQLite and not MySQL?" — say: "SQLite is file-based and requires no server, which makes it ideal for rapid prototyping. In Prototype 3 we plan to migrate to PostgreSQL for production use."

---
---

## ⚡ Quick Reference — Q&A Answers

| If teacher asks... | Who answers | Say... |
|---|---|---|
| "What is a foreign key?" | Dev | "It's a column that stores the ID of a row in another table, creating a link between them." |
| "Why SQLite not MySQL?" | Sakib | "SQLite needs no server, perfect for prototyping. We'll upgrade to PostgreSQL for production." |
| "Is this a real database or fake?" | Dev | "Real. Every action writes to a SQLite file. You can see it live in our DB Inspector." |
| "What is Prisma?" | Dev | "An ORM — it lets us write TypeScript to talk to the database instead of raw SQL." |
| "What is a Server Action?" | Shreyan | "A Next.js feature — a backend function that runs on the server, called directly from the frontend." |
| "Why Next.js?" | Vivek | "It's a full-stack React framework — one codebase handles both UI and backend logic." |
| "What will Prototype 2 have?" | Sakib | "Complaints, Mess Menu, Announcements, and Laundry — each built by a different team member." |
| "How many tables does your DB have?" | Dev | "Currently: User, StudentProfile, Hostel, Room, Bed, GatePass — 6 tables with foreign key relationships." |

---

## ⚠️ Before Friday — Checklist

- [ ] **Vivek:** Run `npm run seed` to reset the database to clean demo state
- [ ] **Vivek:** Make sure `npm run dev` starts without errors
- [ ] **Sushobhan:** Click through Student Dashboard and Profile once
- [ ] **Dev:** Open DB Inspector and confirm all tables are visible
- [ ] **Shreyan:** Do a complete apply → approve flow once as practice
- [ ] **Sakib:** Confirm the DB Inspector shows APPROVED after the approval
- [ ] **Everyone:** Do one full run-through together the night before

---

*KIIT SmartStay · Prototype 1 Demo Script*  
*Vivek · Sushobhan · Dev · Shreyan · Sakib*
