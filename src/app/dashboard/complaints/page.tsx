import ComplaintsClient from "./client";
import { getComplaints } from "@/app/actions/complaints";
import { syncUser } from "@/app/actions/user";

export const dynamic = "force-dynamic";

export default async function ComplaintsPage() {
  const user = await syncUser();
  const role = user?.role || "STUDENT";
  const complaints = await getComplaints();

  return <ComplaintsClient complaints={complaints} role={role} />;
}
