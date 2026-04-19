import LaundryClient from "./client";
import { getLaundryBookings } from "@/app/actions/laundry";

export const dynamic = "force-dynamic";

export default async function LaundryPage() {
  const bookings = await getLaundryBookings();
  
  return <LaundryClient bookings={bookings} />;
}
