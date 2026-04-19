"use client";

import { useState } from "react";
import { updateRoom } from "@/app/actions/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Home } from "lucide-react";

export default function RoomSelector({ currentRoom }: { currentRoom: string | null }) {
  const [room, setRoom] = useState(currentRoom || "");
  const [isUpdating, setIsUpdating] = useState(false);

  if (currentRoom) return null;

  async function handleUpdate() {
    if (!room) return;
    setIsUpdating(true);
    await updateRoom(room);
    setIsUpdating(false);
  }

  return (
    <Card className="border-primary/50 bg-primary/5 border-dashed">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
            <Home className="size-5" /> Finish Profile
        </CardTitle>
        <CardDescription>Please enter your assigned room number to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input 
            placeholder="e.g., 204-B" 
            value={room} 
            onChange={(e) => setRoom(e.target.value)} 
            className="max-w-[200px]"
          />
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="animate-spin size-4" /> : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
