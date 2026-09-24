import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting KIIT SmartStay database seed...");

  // 1. Clean existing records in correct relation order
  await prisma.gateLog.deleteMany();
  await prisma.gatePass.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.laundryBooking.deleteMany();
  await prisma.foodReview.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.bed.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.messMenu.deleteMany();
  await prisma.announcement.deleteMany();

  // 2. Seed Hostel: King's Palace 7 (KP-7)
  const kp7 = await prisma.hostel.create({
    data: {
      name: "King's Palace 7",
      code: "KP-7",
      campus: "Campus 12 (ICT)",
    },
  });

  // 3. Seed Rooms & Beds in KP-7
  const roomNumbers = ["101", "102", "201", "205", "308", "318", "412", "514", "520"];
  for (const rNo of roomNumbers) {
    const room = await prisma.room.create({
      data: {
        hostelId: kp7.id,
        roomNo: rNo,
      },
    });

    for (const bNo of ["A", "B", "C"]) {
      await prisma.bed.create({
        data: {
          roomId: room.id,
          bedNo: bNo,
        },
      });
    }
  }

  // 4. Seed the 5 Main Group Member Accounts
  // Member 1 (You): Vivek Yadav (Student)
  const vivek = await prisma.user.create({
    data: {
      id: "student_vivek_22051934",
      name: "Vivek Yadav",
      email: "vivekyadav1207vy@gmail.com",
      role: "STUDENT",
      biometricStatus: "IN_HOSTEL",
      studentProfile: {
        create: {
          rollNo: "22051934",
          branch: "Computer Science & Engineering",
          semester: 6,
          year: 3,
          hostelId: kp7.id,
          roomNo: "412",
          bedNo: "B",
          phone: "+91 98765 43210",
        },
      },
    },
  });

  // Member 2: Ayush Sharma (Student)
  const ayush = await prisma.user.create({
    data: {
      id: "student_ayush_22051410",
      name: "Ayush Sharma",
      email: "ayush.sharma@kiit.ac.in",
      role: "STUDENT",
      biometricStatus: "IN_HOSTEL",
      studentProfile: {
        create: {
          rollNo: "22051410",
          branch: "Computer Science & Engineering",
          semester: 6,
          year: 3,
          hostelId: kp7.id,
          roomNo: "318",
          bedNo: "A",
          phone: "+91 98612 88771",
        },
      },
    },
  });

  // Member 3: Rahul Kumar (Student)
  const rahul = await prisma.user.create({
    data: {
      id: "student_rahul_22051882",
      name: "Rahul Kumar",
      email: "rahul.kumar@kiit.ac.in",
      role: "STUDENT",
      biometricStatus: "IN_HOSTEL",
      studentProfile: {
        create: {
          rollNo: "22051882",
          branch: "Information Technology",
          semester: 6,
          year: 3,
          hostelId: kp7.id,
          roomNo: "205",
          bedNo: "C",
          phone: "+91 94371 55442",
        },
      },
    },
  });

  // Member 4: Prof. S. K. Mohapatra (Chief Warden)
  const warden = await prisma.user.create({
    data: {
      id: "warden_kp7",
      name: "Prof. S. K. Mohapatra",
      email: "warden.kp7@kiit.ac.in",
      role: "WARDEN",
      biometricStatus: "IN_HOSTEL",
    },
  });

  // Member 5: Havildar R. K. Swain (Security Officer)
  const security = await prisma.user.create({
    data: {
      id: "guard_kp7",
      name: "Havildar R. K. Swain",
      email: "security.kp7@kiit.ac.in",
      role: "SECURITY",
      biometricStatus: "IN_HOSTEL",
    },
  });

  // 5. Seed 25 Additional Demo Students with realistic KIIT data
  const extraStudentData = [
    { name: "Subham Biswal", rollNo: "22050811", branch: "CSE", room: "101", bed: "A" },
    { name: "Priyanshu Dash", rollNo: "22053120", branch: "CSE", room: "101", bed: "B" },
    { name: "Ankit Singh", rollNo: "22052441", branch: "IT", room: "102", bed: "A" },
    { name: "Rohan Panda", rollNo: "22051109", branch: "CSCE", room: "102", bed: "B" },
    { name: "Siddharth Verma", rollNo: "22050432", branch: "CSE", room: "201", bed: "A" },
    { name: "Aman Gupta", rollNo: "22051780", branch: "CSSE", room: "201", bed: "B" },
    { name: "Devansh Tripathy", rollNo: "22052994", branch: "CSE", room: "205", bed: "A" },
    { name: "Abhishek Jena", rollNo: "22053412", branch: "ECE", room: "205", bed: "B" },
    { name: "Tanmay Sahoo", rollNo: "22050663", branch: "CSE", room: "308", bed: "A" },
    { name: "Harshwardhan Patel", rollNo: "22051554", branch: "IT", room: "308", bed: "B" },
    { name: "Kunal Mohanty", rollNo: "22052219", branch: "CSE", room: "318", bed: "B" },
    { name: "Sourabh Mishra", rollNo: "22054101", branch: "ETC", room: "318", bed: "C" },
    { name: "Aditya Narayan", rollNo: "22050987", branch: "CSE", room: "412", bed: "A" },
    { name: "Rituraj Sen", rollNo: "22053776", branch: "CSE", room: "412", bed: "C" },
    { name: "Nikhil Nayak", rollNo: "22051345", branch: "CSSE", room: "514", bed: "A" },
    { name: "Shubham Agarwal", rollNo: "22052890", branch: "IT", room: "514", bed: "B" },
    { name: "Manish Swain", rollNo: "22054321", branch: "CSE", room: "520", bed: "A" },
    { name: "Aniket Choudhury", rollNo: "22050112", branch: "CSE", room: "520", bed: "B" },
    { name: "Debabrata Rout", rollNo: "22051999", branch: "IT", room: "101", bed: "C" },
    { name: "Swayam Prakash", rollNo: "22053221", branch: "CSE", room: "102", bed: "C" },
    { name: "Ritwik Acharya", rollNo: "22052678", branch: "ECE", room: "201", bed: "C" },
    { name: "Deepak Sahu", rollNo: "22054890", branch: "CSE", room: "308", bed: "C" },
    { name: "Kaushik Bhowmick", rollNo: "22050774", branch: "CSSE", room: "514", bed: "C" },
    { name: "Partha Sarathi", rollNo: "22053556", branch: "CSE", room: "520", bed: "C" },
    { name: "Omkar Mohapatra", rollNo: "22051228", branch: "IT", room: "205", bed: "C" },
  ];

  for (const s of extraStudentData) {
    await prisma.user.create({
      data: {
        name: s.name,
        email: `${s.rollNo}@kiit.ac.in`,
        role: "STUDENT",
        biometricStatus: "IN_HOSTEL",
        studentProfile: {
          create: {
            rollNo: s.rollNo,
            branch: s.branch === "CSE" ? "Computer Science & Engineering" : s.branch === "IT" ? "Information Technology" : "Electronics & Telecommunication",
            semester: 6,
            year: 3,
            hostelId: kp7.id,
            roomNo: s.room,
            bedNo: s.bed,
            phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
          },
        },
      },
    });
  }

  // 6. Seed Gate Passes & Gate Logs (Connects the Turnstile Workflow!)
  // Active Pass for Vivek Yadav
  const pass1 = await prisma.gatePass.create({
    data: {
      passCode: "GP-2026-0812",
      userId: vivek.id,
      destination: "KIIT Central Library (Campus 6)",
      purpose: "3rd-year semester capstone project research and group coding",
      departureTime: new Date(),
      returnTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: "APPROVED",
      approvedById: warden.id,
      approvedAt: new Date(Date.now() - 30 * 60 * 1000),
      curfewDeadline: "08:30 PM",
      qrData: `KIIT-PASS-22051934-GP-2026-0812-VALID`,
      wardenRemark: "Approved by Prof. S. K. Mohapatra (Chief Warden KP-7)",
    },
  });

  // Historical Gate Log for audit story
  await prisma.gateLog.create({
    data: {
      userId: vivek.id,
      passId: pass1.id,
      action: "PUNCH_IN",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  // Pending Pass for Ayush Sharma (Warden Approval Demo)
  await prisma.gatePass.create({
    data: {
      passCode: "GP-2026-9041",
      userId: ayush.id,
      destination: "KIMS Hospital (Campus 5)",
      purpose: "Routine orthopedic follow-up & physiotherapy session",
      departureTime: new Date(),
      returnTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      status: "PENDING",
      curfewDeadline: "08:30 PM",
      qrData: `KIIT-PASS-22051410-GP-2026-9041-PENDING`,
    },
  });

  // Pending Pass for Rahul Kumar
  await prisma.gatePass.create({
    data: {
      passCode: "GP-2026-4421",
      userId: rahul.id,
      destination: "Campus 12 Food Court & Gym",
      purpose: "Evening fitness training & project discussion",
      departureTime: new Date(),
      returnTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: "PENDING",
      curfewDeadline: "08:30 PM",
      qrData: `KIIT-PASS-22051882-GP-2026-4421-PENDING`,
    },
  });

  // 7. Seed Complaints
  await prisma.complaint.create({
    data: {
      ticketId: "KIIT-KP7-1001",
      userId: vivek.id,
      category: "ELECTRICAL",
      title: "AC Not Cooling & Filter Choked",
      description: "Air conditioner in room 412 is blowing ambient air and making rattling noise. Needs gas check and filter cleaning.",
      location: "Room 412 (Bed B)",
      assignedTo: "Ramesh Behera (KP-7 Electrician)",
      assignedContact: "+91 98612 34567",
      resolutionOtp: "4829",
      status: "IN_PROGRESS",
    },
  });

  await prisma.complaint.create({
    data: {
      ticketId: "KIIT-KP7-1002",
      userId: ayush.id,
      category: "PLUMBING",
      title: "Bathroom Tap Leakage & Low Water Pressure",
      description: "Sink faucet dripping continuously causing water wastage on 3rd floor west wing.",
      location: "Room 318",
      assignedTo: "Pradeep Sahoo (Plumber)",
      assignedContact: "+91 98611 22334",
      resolutionOtp: "8120",
      status: "ASSIGNED",
    },
  });

  await prisma.complaint.create({
    data: {
      ticketId: "KIIT-KP7-1003",
      userId: rahul.id,
      category: "WIFI",
      title: "Wi-Fi Access Point Frequent Disconnections",
      description: "Campus 12 high-speed router KP7-AP402 having packet drops during evening lab hours.",
      location: "Floor 2 Corridor",
      assignedTo: "Bikram Ray (Network Admin)",
      assignedContact: "+91 94372 99881",
      resolutionOtp: "9931",
      status: "REGISTERED",
    },
  });

  // 8. Seed Laundry Booking
  await prisma.laundryBooking.create({
    data: {
      userId: vivek.id,
      token: "LND-KP7-720",
      itemCount: 6,
      shirts: 3,
      trousers: 2,
      bedsheets: 1,
      towels: 0,
      pickupOtp: "7392",
      stage: "READY",
      bookingDate: new Date(),
    },
  });

  await prisma.laundryBooking.create({
    data: {
      userId: ayush.id,
      token: "LND-KP7-721",
      itemCount: 5,
      shirts: 2,
      trousers: 2,
      bedsheets: 0,
      towels: 1,
      pickupOtp: "3411",
      stage: "WASHING",
      bookingDate: new Date(),
    },
  });

  // 9. Seed Food Reviews (Authentic reviews with real calculations)
  const reviews = [
    {
      userId: vivek.id,
      mealType: "LUNCH",
      overallRating: 5,
      tasteRating: 5,
      hygieneRating: 5,
      portionRating: 4,
      serviceRating: 5,
      comment: "The authentic Odia Dalma and Butter Chicken / Paneer Lababdar were incredible today! Fresh phulkas served hot at counter.",
      anonymous: false,
    },
    {
      userId: ayush.id,
      mealType: "BREAKFAST",
      overallRating: 4,
      tasteRating: 4,
      hygieneRating: 5,
      portionRating: 5,
      serviceRating: 4,
      comment: "Crispy Medu Vada and hot Madras Sambar were great. Coconut chutney was fresh and cold.",
      anonymous: false,
    },
    {
      userId: rahul.id,
      mealType: "DINNER",
      overallRating: 5,
      tasteRating: 5,
      hygieneRating: 4,
      portionRating: 5,
      serviceRating: 5,
      comment: "Warm Gulab Jamuns after heavy lab day made my day! Good hygiene maintained by kitchen staff.",
      anonymous: true,
    },
  ];

  for (const r of reviews) {
    await prisma.foodReview.create({ data: r });
  }

  // 10. Seed 7-Day Complete Mess Menu
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  for (const day of days) {
    await prisma.messMenu.createMany({
      data: [
        {
          day,
          mealType: "BREAKFAST",
          menuItems: "Idli, Medu Vada, Masala Upma, Coconut Chutney, Sambhar, Boiled Eggs / Banana, Tea & Coffee",
          specialItem: "Medu Vada & Filter Coffee",
          isVeg: false,
          isSpecial: false,
          startTime: "07:30 AM",
          endTime: "09:30 AM",
        },
        {
          day,
          mealType: "LUNCH",
          menuItems: "Steamed Rice, Jeera Pulao, Odia Dalma, Yellow Dal Tadka, Paneer Butter Masala, Chicken Curry, Papad, Curd, Green Salad",
          specialItem: day === "Sunday" ? "Authentic Hyderabadi Dum Biryani" : "Odia Dalma Feast",
          isVeg: false,
          isSpecial: day === "Sunday" || day === "Wednesday",
          startTime: "12:00 PM",
          endTime: "02:30 PM",
        },
        {
          day,
          mealType: "SNACKS",
          menuItems: "Pav Bhaji, Samosa Chaat, Veg Cutlet, Adrak Masala Chai, Nescafe Coffee",
          specialItem: "Mumbai Pav Bhaji",
          isVeg: true,
          isSpecial: false,
          startTime: "05:00 PM",
          endTime: "06:15 PM",
        },
        {
          day,
          mealType: "DINNER",
          menuItems: "Tawa Roti, Butter Naan, Dal Makhani, Seasonal Subzi, Malai Kofta / Egg Curry, Rasgulla / Gulab Jamun",
          specialItem: "Piping Hot Gulab Jamun",
          isVeg: false,
          isSpecial: true,
          startTime: "07:30 PM",
          endTime: "09:45 PM",
        },
      ],
    });
  }

  // 11. Seed Hostel Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: "Kritansh Fest 2026: Extended Hostel Curfew to 10:00 PM",
        description: "All registered KIIT hostel residents participating in Kritansh Fest are granted curfew extension till 10:00 PM from Friday to Sunday. Carry your KIIT Student RFID ID card at gate checkpoints.",
        category: "CURFEW",
        priority: "IMPORTANT",
        issuedBy: "Chief Warden, KP-7",
      },
      {
        title: "Routine Electrical & Geyser Maintenance (KP-7 Floors 3 & 4)",
        description: "Maintenance engineering team will inspect individual water heaters, distribution boards, and emergency lights on Thursday between 10:00 AM and 01:00 PM.",
        category: "MAINTENANCE",
        priority: "NORMAL",
        issuedBy: "Superintendent, KP-7",
      },
      {
        title: "Special Sunday Odia Feast Menu Approved by Mess Committee",
        description: "Following the recommendations of the student mess representatives, this Sunday will feature authentic Dum Biryani and traditional Odia sweets.",
        category: "MESS",
        priority: "NORMAL",
        issuedBy: "Mess Committee Chairperson, KIIT",
      },
      {
        title: "Mandatory Biometric Punch Before 08:30 PM In-Time Curfew",
        description: "Strict compliance is requested for nightly attendance. Students returning after 08:30 PM must hold a digital gate pass approved by the hostel warden.",
        category: "CURFEW",
        priority: "URGENT",
        issuedBy: "Hostel Administration KP-7",
      },
      {
        title: "End-Semester Quiet Hours & Study Room Access (24x7)",
        description: "In view of upcoming 6th semester mid-term & practical lab evaluations, the air-conditioned reading halls on Ground Floor of KP-7 will remain open 24x7 with high-speed Wi-Fi.",
        category: "GENERAL",
        priority: "NORMAL",
        issuedBy: "Academic Cell, KP-7",
      },
    ],
  });

  // 12. Seed Fees for Vivek Yadav
  await prisma.fee.createMany({
    data: [
      {
        userId: vivek.id,
        month: "Spring Semester 2026",
        amount: 45000,
        status: "PAID",
        type: "HOSTEL",
        dueDate: new Date(),
      },
      {
        userId: vivek.id,
        month: "Mess Facility (Semester)",
        amount: 5200,
        status: "PAID",
        type: "MESS",
        dueDate: new Date(),
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log("📊 Summary of seeded records:");
  console.log(`- Hostel: 1 (${kp7.name})`);
  console.log(`- Total Users: ${await prisma.user.count()} (5 Group Members + 25 Students)`);
  console.log(`- Student Profiles: ${await prisma.studentProfile.count()}`);
  console.log(`- Rooms: ${await prisma.room.count()} | Beds: ${await prisma.bed.count()}`);
  console.log(`- Gate Passes: ${await prisma.gatePass.count()} | Gate Logs: ${await prisma.gateLog.count()}`);
  console.log(`- Complaints: ${await prisma.complaint.count()}`);
  console.log(`- Laundry Bookings: ${await prisma.laundryBooking.count()}`);
  console.log(`- Food Reviews: ${await prisma.foodReview.count()}`);
  console.log(`- Mess Menu Items: ${await prisma.messMenu.count()}`);
  console.log(`- Announcements: ${await prisma.announcement.count()}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
