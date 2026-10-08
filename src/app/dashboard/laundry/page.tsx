import { getWashingMachines } from "@/app/actions/washing-machine";
import { syncUser } from "@/app/actions/user";
import WashingMachineClient from "./client";

export const dynamic = "force-dynamic";

export default async function LaundryPage() {
  const user = await syncUser();
  const machines = await getWashingMachines();

  return (
    <WashingMachineClient
      initialMachines={machines as any}
      userRole={user?.role || "STUDENT"}
    />
  );
}
