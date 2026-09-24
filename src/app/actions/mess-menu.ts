"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function getMessMenu(dayOfWeek?: string) {
  try {
    const targetDay = dayOfWeek || dayNames[new Date().getDay()];
    const menu = await prisma.messMenu.findMany({
      where: targetDay ? { day: targetDay } : undefined,
      orderBy: { id: "asc" },
    });
    return menu.map((m) => ({
      ...m,
      dayOfWeek: m.day,
      items: m.menuItems,
      isVegOnly: m.isVeg,
      timing: `${m.startTime} - ${m.endTime}`,
    }));
  } catch (error) {
    console.error("Get mess menu error:", error);
    return [];
  }
}

export async function getAllWeekMenu() {
  try {
    const menu = await prisma.messMenu.findMany({
      orderBy: { id: "asc" },
    });
    return menu.map((m) => ({
      ...m,
      dayOfWeek: m.day,
      items: m.menuItems,
      isVegOnly: m.isVeg,
      timing: `${m.startTime} - ${m.endTime}`,
    }));
  } catch (error) {
    console.error("Get all week menu error:", error);
    return [];
  }
}

export async function getCurrentMealInfo() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMins = hours * 60 + minutes;

  // Timings:
  // Breakfast: 07:30 to 09:30 (450 - 570 mins)
  // Lunch: 12:00 to 14:30 (720 - 870 mins)
  // Snacks: 17:00 to 18:30 (1020 - 1110 mins)
  // Dinner: 19:30 to 21:45 (1170 - 1305 mins)

  let activeMeal: "BREAKFAST" | "LUNCH" | "SNACKS" | "DINNER" | null = null;
  let nextMeal: string = "Breakfast";
  let statusText = "Mess is currently closed";

  if (totalMins >= 450 && totalMins <= 570) {
    activeMeal = "BREAKFAST";
    statusText = "Breakfast is currently serving";
    nextMeal = "Lunch (12:00 PM)";
  } else if (totalMins > 570 && totalMins < 720) {
    nextMeal = "Lunch (12:00 PM)";
    statusText = "Breakfast finished. Next: Lunch";
  } else if (totalMins >= 720 && totalMins <= 870) {
    activeMeal = "LUNCH";
    statusText = "Lunch is currently serving";
    nextMeal = "Evening Snacks (05:00 PM)";
  } else if (totalMins > 870 && totalMins < 1020) {
    nextMeal = "Evening Snacks (05:00 PM)";
    statusText = "Lunch finished. Next: Evening Snacks";
  } else if (totalMins >= 1020 && totalMins <= 1110) {
    activeMeal = "SNACKS";
    statusText = "Evening Snacks & Tea serving";
    nextMeal = "Dinner (07:30 PM)";
  } else if (totalMins > 1110 && totalMins < 1170) {
    nextMeal = "Dinner (07:30 PM)";
    statusText = "Snacks finished. Next: Dinner";
  } else if (totalMins >= 1170 && totalMins <= 1305) {
    activeMeal = "DINNER";
    statusText = "Dinner is currently serving";
    nextMeal = "Tomorrow's Breakfast (07:30 AM)";
  } else {
    nextMeal = "Tomorrow's Breakfast (07:30 AM)";
    statusText = "Dinner finished. Mess closed for the night.";
  }

  const currentDayName = dayNames[now.getDay()];
  const rawMeal = activeMeal
    ? await prisma.messMenu.findFirst({
        where: { day: currentDayName, mealType: activeMeal },
      })
    : null;

  const currentMealItem = rawMeal
    ? {
        ...rawMeal,
        dayOfWeek: rawMeal.day,
        items: rawMeal.menuItems,
        isVegOnly: rawMeal.isVeg,
        timing: `${rawMeal.startTime} - ${rawMeal.endTime}`,
      }
    : null;

  return {
    currentDayName,
    activeMeal,
    nextMeal,
    statusText,
    currentMealItem,
    schedule: [
      { name: "Breakfast", time: "07:30 AM - 09:30 AM", type: "BREAKFAST" },
      { name: "Lunch", time: "12:00 PM - 02:30 PM", type: "LUNCH" },
      { name: "Evening Snacks", time: "05:00 PM - 06:15 PM", type: "SNACKS" },
      { name: "Dinner", time: "07:30 PM - 09:45 PM", type: "DINNER" },
    ],
  };
}
