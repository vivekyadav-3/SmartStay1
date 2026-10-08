import studentsData from "@/data/kiit-students.json";

export interface KiitStudent {
  roll: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  branch: string;
  semester: number;
  year: number;
  hostelName: string;
  hostelCode: string;
  campus: string;
  roomNo: string;
  bedNo: string;
}

const list = studentsData as KiitStudent[];
const rollMap = new Map<string, KiitStudent>();
const emailMap = new Map<string, KiitStudent>();

for (let i = 0; i < list.length; i++) {
  const s = list[i];
  if (s.roll) rollMap.set(s.roll.toLowerCase().trim(), s);
  if (s.email) emailMap.set(s.email.toLowerCase().trim(), s);
}

export function findKiitStudent(identifier: string): KiitStudent | null {
  if (!identifier) return null;
  const clean = identifier.toLowerCase().trim();

  // Try exact email
  const byEmail = emailMap.get(clean);
  if (byEmail) return byEmail;

  // Try exact roll
  const byRoll = rollMap.get(clean);
  if (byRoll) return byRoll;

  // Extract numeric digits (e.g. "2405001" from "2405001@kiit.ac.in")
  const match = clean.match(/\d+/);
  if (match) {
    const byDigits = rollMap.get(match[0]);
    if (byDigits) return byDigits;
  }

  return null;
}
