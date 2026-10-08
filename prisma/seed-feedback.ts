import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleComments = [
  "The library pass approval is so fast now! Used to wait for wardens physically, now it gets approved in minutes.",
  "Washing machine pre-booking is a lifesaver. Never have to carry heavy bucket to laundry room just to see machines occupied.",
  "Digital Notice board is super helpful. I immediately saw the Sunday Biryani menu without walking down to the reception.",
  "App UI is very clean and easy to navigate. Light and dark blue theme looks official and professional.",
  "The room complaint tracker is great. Electrician arrived within 3 hours and closure OTP makes sure the issue is fixed.",
  "Medical SOS feature gives peace of mind. Knowing ambulance is 1 tap away is reassuring for hostel residents.",
  "Mess food review helps us express feedback about daily meals. Dalma and Chicken were delicious this week.",
  "Smooth login using KIIT email. Changing password after first login was effortless.",
  "Night reading room pass with 08:30 PM curfew countdown is very clear. No confusion with security guards.",
  "Very modern hostel portal. KP-7 feels truly digitized compared to old paper registers.",
  "Best feature is washing machine slot allocation. Only the booked student gets the access PIN.",
  "Notice board event updates are great. Cricket league registrations were updated on time.",
  "Simple, fast, and works seamlessly on mobile phone as well.",
  "Plumbing issue in room 412 was resolved within 2 hours of filing the complaint.",
  "Rating meals 5 stars for Sunday special lunch. Keep up the high standards!",
  "Great initiative by KIIT student affairs. Every hostel should use this portal.",
  "Curfew reminder and library pass barcode works smoothly at turnstile gate.",
  "No lags, very responsive interface. Extremely easy to use even for first-year juniors.",
  "App is reliable and straightforward. Zero clutter, everything needed is right on dashboard.",
  "Warden approval notification arrived quickly. Cleanest institutional app so far."
];

const branches = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Electrical & Electronics",
  "Civil Engineering",
  "Biotechnology",
  "Data Science & AI"
];

async function seedFeedbacks() {
  console.log("Checking current feedback count...");
  const count = await prisma.feedback.count();
  console.log(`Current feedback count: ${count}`);

  if (count < 100) {
    console.log(`Seeding up to 105 feedbacks...`);
    
    // Ensure we have active student users or create them
    let hostel = await prisma.hostel.findFirst();
    if (!hostel) {
      hostel = await prisma.hostel.create({
        data: { name: "King's Palace 7", code: "KP-7", campus: "Campus 12" }
      });
    }

    const needed = 105 - count;
    for (let i = 1; i <= needed; i++) {
      const rollNum = 22051000 + count + i;
      const email = `${rollNum}@kiit.ac.in`;
      
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: `KIITian Resident ${count + i}`,
            email,
            passwordHash: "$2a$10$demoHashedPasswordSmartStay2026",
            role: "STUDENT",
            biometricStatus: i % 5 === 0 ? "OUTSIDE_CAMPUS" : "IN_HOSTEL",
            studentProfile: {
              create: {
                rollNo: `${rollNum}`,
                branch: branches[i % branches.length],
                semester: 6,
                year: 3,
                hostelId: hostel.id,
                roomNo: `${100 + (i % 40)}`,
                bedNo: i % 3 === 0 ? "A" : i % 3 === 1 ? "B" : "C",
              }
            }
          }
        });
      }

      // Rating distribution: mostly 4 and 5 stars, occasional 3
      const rating = i % 15 === 0 ? 3 : i % 4 === 0 ? 4 : 5;
      const comment = sampleComments[i % sampleComments.length];
      const categories = ["OVERALL", "GATE_PASS", "MESS", "LAUNDRY", "COMPLAINTS", "ANNOUNCEMENTS"];
      const category = categories[i % categories.length];

      await prisma.feedback.create({
        data: {
          userId: user.id,
          rating,
          reviewText: `${comment} (Review #${count + i})`,
          category,
          createdAt: new Date(Date.now() - (i * 3600 * 1000 * 4)) // Staggered over recent days
        }
      });
    }
    console.log("Successfully seeded over 100 feedbacks!");
  } else {
    console.log(`Already have ${count} feedbacks. No extra seeding required.`);
  }

  const finalCount = await prisma.feedback.count();
  console.log(`Final total feedbacks in DB: ${finalCount}`);
}

seedFeedbacks()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
