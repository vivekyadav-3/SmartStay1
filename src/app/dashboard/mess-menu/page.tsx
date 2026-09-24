"use client";

import { useState } from "react";
import { 
  UtensilsCrossed, 
  Clock, 
  Coffee, 
  Soup, 
  Flame, 
  Leaf, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  CalendarDays
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MenuItem {
  dayOfWeek: string;
  mealType: string;
  timing: string;
  items: string;
  specialItem: string;
  isVegOnly: boolean;
  calories: string;
}

const fullWeekMenu: Record<string, MenuItem[]> = {
  Monday: [
    {
      dayOfWeek: "Monday",
      mealType: "BREAKFAST",
      timing: "07:30 AM - 09:30 AM",
      items: "Stuffed Punjabi Aloo Paratha, Fresh Curd, Pickle, Boiled Eggs / Fresh Banana, Masala Chai & Milk",
      specialItem: "Stuffed Aloo Paratha with Curd",
      isVegOnly: false,
      calories: "520 kcal",
    },
    {
      dayOfWeek: "Monday",
      mealType: "LUNCH",
      timing: "12:30 PM - 02:30 PM",
      items: "Steamed Basmati Rice, Tawa Phulka, Dal Tadka, Seasonal Mix Veg, Paneer Butter Masala (Veg) / Chicken Curry (Non-Veg), Papad, Onion & Lemon Salad",
      specialItem: "Paneer Butter Masala / Chicken Curry",
      isVegOnly: false,
      calories: "780 kcal",
    },
    {
      dayOfWeek: "Monday",
      mealType: "SNACKS",
      timing: "05:00 PM - 06:30 PM",
      items: "Crispy Vegetable Cutlet with Tangy Mint Chutney, Marie Biscuits, Hot Masala Tea / Filter Coffee",
      specialItem: "Crispy Vegetable Cutlet",
      isVegOnly: true,
      calories: "280 kcal",
    },
    {
      dayOfWeek: "Monday",
      mealType: "DINNER",
      timing: "07:30 PM - 09:45 PM",
      items: "Jeera Rice, Butter Roti, Dal Makhani, Lauki Kofta Curry, Aloo Capsicum, Warm Gulab Jamun",
      specialItem: "Warm Gulab Jamun",
      isVegOnly: true,
      calories: "710 kcal",
    },
  ],
  Tuesday: [
    {
      dayOfWeek: "Tuesday",
      mealType: "BREAKFAST",
      timing: "07:30 AM - 09:30 AM",
      items: "Crispy Masala Dosa, Madras Sambhar, Fresh Coconut & Tomato Chutney, Boiled Eggs / Banana, Tea / Coffee",
      specialItem: "Crispy Masala Dosa with Sambar",
      isVegOnly: false,
      calories: "490 kcal",
    },
    {
      dayOfWeek: "Tuesday",
      mealType: "LUNCH",
      timing: "12:30 PM - 02:30 PM",
      items: "Steamed Rice, Tawa Roti, Dal Fry, Aloo Gobi Matar, Egg Curry (Non-Veg) / Kadhai Paneer (Veg), Boondi Raita, Roasted Papad",
      specialItem: "Egg Curry / Kadhai Paneer",
      isVegOnly: false,
      calories: "760 kcal",
    },
    {
      dayOfWeek: "Tuesday",
      mealType: "SNACKS",
      timing: "05:00 PM - 06:30 PM",
      items: "Indori Poha with Roasted Peanuts & Crispy Sev, Lemon Wedge, Ginger Cardamom Tea",
      specialItem: "Indori Poha",
      isVegOnly: true,
      calories: "250 kcal",
    },
    {
      dayOfWeek: "Tuesday",
      mealType: "DINNER",
      timing: "07:30 PM - 09:45 PM",
      items: "Phulka, Steamed Rice, Moong Dal Tadka, Kashmiri Dum Aloo, Bhindi Fry, Odia Rice Kheer with Dry Fruits",
      specialItem: "Authentic Odia Rice Kheer",
      isVegOnly: true,
      calories: "690 kcal",
    },
  ],
  Wednesday: [
    {
      dayOfWeek: "Wednesday",
      mealType: "BREAKFAST",
      timing: "07:30 AM - 09:30 AM",
      items: "Hot Puri with Aloo Chana Bhaji, Kesari Suji Halwa, Boiled Eggs / Banana, Tea & Coffee",
      specialItem: "Hot Puri Sabji & Kesari Halwa",
      isVegOnly: false,
      calories: "580 kcal",
    },
    {
      dayOfWeek: "Wednesday",
      mealType: "LUNCH",
      timing: "12:30 PM - 02:30 PM",
      items: "Basmati Rice, Chapati, Dal Tadka, Baingan Masala, Odia Fish Curry (Machha Jhola) / Shahi Paneer, Green Salad, Roasted Papad",
      specialItem: "Odia Machha Jhola (Fish Curry) / Shahi Paneer",
      isVegOnly: false,
      calories: "820 kcal",
    },
    {
      dayOfWeek: "Wednesday",
      mealType: "SNACKS",
      timing: "05:00 PM - 06:30 PM",
      items: "Hot Vegetable Samosa with Tangy Tamarind & Mint Chutney, Masala Chai",
      specialItem: "Hostel Samosa with Chutney",
      isVegOnly: true,
      calories: "320 kcal",
    },
    {
      dayOfWeek: "Wednesday",
      mealType: "DINNER",
      timing: "07:30 PM - 09:45 PM",
      items: "Veg Dum Biryani, Mixed Veg Raita, Dal Makhani, Paneer Do Pyaza, Ice Cream Cup",
      specialItem: "Dum Biryani & Vanilla Ice Cream",
      isVegOnly: true,
      calories: "740 kcal",
    },
  ],
  Thursday: [
    {
      dayOfWeek: "Thursday",
      mealType: "BREAKFAST",
      timing: "07:30 AM - 09:30 AM",
      items: "Onion Tomato Uttapam, Drumstick Sambar, Coconut Chutney, Boiled Eggs / Banana, Filter Coffee & Tea",
      specialItem: "Uttapam with Drumstick Sambar",
      isVegOnly: false,
      calories: "470 kcal",
    },
    {
      dayOfWeek: "Thursday",
      mealType: "LUNCH",
      timing: "12:30 PM - 02:30 PM",
      items: "Jeera Rice, Tawa Roti, Yellow Moong Dal, Bhindi Kurkuri, Paneer Pasanda, Sweet Curd, Papad",
      specialItem: "Paneer Pasanda with Sweet Curd",
      isVegOnly: true,
      calories: "750 kcal",
    },
    {
      dayOfWeek: "Thursday",
      mealType: "SNACKS",
      timing: "05:00 PM - 06:30 PM",
      items: "Crispy Bread Pakora with Green Chutney & Tomato Sauce, Ginger Tea",
      specialItem: "Crispy Bread Pakora",
      isVegOnly: true,
      calories: "310 kcal",
    },
    {
      dayOfWeek: "Thursday",
      mealType: "DINNER",
      timing: "07:30 PM - 09:45 PM",
      items: "Tawa Phulka, Steamed Rice, Punjabi Rajma Masala, Aloo Jeera, Bengali Rasgulla",
      specialItem: "Punjabi Rajma & Rasgulla",
      isVegOnly: true,
      calories: "700 kcal",
    },
  ],
  Friday: [
    {
      dayOfWeek: "Friday",
      mealType: "BREAKFAST",
      timing: "07:30 AM - 09:30 AM",
      items: "Steaming Hot Idli & Crispy Medu Vada, Madras Sambar, Coconut & Tomato Chutney, Boiled Eggs / Banana, Tea / Coffee",
      specialItem: "Hot Idli & Medu Vada Combo",
      isVegOnly: false,
      calories: "510 kcal",
    },
    {
      dayOfWeek: "Friday",
      mealType: "LUNCH",
      timing: "12:30 PM - 02:30 PM",
      items: "Veg Pulao, Chapati, Authentic Odia Dalma (Lentils + Vegetables), Crispy Aloo Bhaja, Butter Chicken (Non-Veg) / Paneer Lababdar (Veg), Curd, Papad",
      specialItem: "Authentic Odia Dalma & Butter Chicken / Paneer Lababdar",
      isVegOnly: false,
      calories: "840 kcal",
    },
    {
      dayOfWeek: "Friday",
      mealType: "SNACKS",
      timing: "05:00 PM - 06:30 PM",
      items: "Mumbai Pav Bhaji with Butter Toasted Buns, Chopped Onions & Lemon, Masala Chai",
      specialItem: "Butter Pav Bhaji",
      isVegOnly: true,
      calories: "360 kcal",
    },
    {
      dayOfWeek: "Friday",
      mealType: "DINNER",
      timing: "07:30 PM - 09:45 PM",
      items: "Butter Naan / Tawa Roti, Kashmiri Pulao, Dal Fry, Malai Kofta (Veg) / Egg Curry (Non-Veg), Hot Jalebi with Rabdi",
      specialItem: "Malai Kofta & Jalebi with Rabdi",
      isVegOnly: false,
      calories: "790 kcal",
    },
  ],
  Saturday: [
    {
      dayOfWeek: "Saturday",
      mealType: "BREAKFAST",
      timing: "07:30 AM - 09:30 AM",
      items: "Methi Paratha with White Butter, Mango Pickle, Sprouted Moong Salad, Fresh Milk / Tea",
      specialItem: "Methi Paratha with White Butter",
      isVegOnly: true,
      calories: "480 kcal",
    },
    {
      dayOfWeek: "Saturday",
      mealType: "LUNCH",
      timing: "12:30 PM - 02:30 PM",
      items: "Steamed Rice, Tawa Roti, Arhar Dal Tadka, Seasonal Mix Sabji, Matar Paneer (Veg) / Fish Amritsari (Non-Veg), Fresh Salad",
      specialItem: "Matar Paneer / Fish Amritsari",
      isVegOnly: false,
      calories: "770 kcal",
    },
    {
      dayOfWeek: "Saturday",
      mealType: "SNACKS",
      timing: "05:00 PM - 06:30 PM",
      items: "Grilled Veg Cheese Sandwich / Masala Maggi, Hot Ginger Tea & Coffee",
      specialItem: "Grilled Veg Cheese Sandwich",
      isVegOnly: true,
      calories: "290 kcal",
    },
    {
      dayOfWeek: "Saturday",
      mealType: "DINNER",
      timing: "07:30 PM - 09:45 PM",
      items: "Tandoori Roti, Veg Pulao, Dal Tadka, Soya Chaap Curry, Moong Dal Halwa",
      specialItem: "Rich Moong Dal Halwa",
      isVegOnly: true,
      calories: "720 kcal",
    },
  ],
  Sunday: [
    {
      dayOfWeek: "Sunday",
      mealType: "BREAKFAST",
      timing: "07:30 AM - 09:30 AM",
      items: "Chole Bhature with Pickled Onions, Fried Green Chillies, Sweet Punjabi Lassi & Masala Tea",
      specialItem: "Special Sunday Chole Bhature with Sweet Lassi",
      isVegOnly: true,
      calories: "620 kcal",
    },
    {
      dayOfWeek: "Sunday",
      mealType: "LUNCH",
      timing: "12:30 PM - 02:30 PM",
      items: "Grand KIIT Sunday Feast: Hyderabadi Dum Chicken Biryani (Non-Veg) / Royal Paneer Biryani (Veg), Mirchi Ka Salan, Burani Raita, Double Ka Meetha",
      specialItem: "Grand Dum Biryani Feast & Double Ka Meetha",
      isVegOnly: false,
      calories: "920 kcal",
    },
    {
      dayOfWeek: "Sunday",
      mealType: "SNACKS",
      timing: "05:00 PM - 06:30 PM",
      items: "Mysore Bonda with Coconut Chutney, Hot South Indian Filter Coffee / Tea",
      specialItem: "Mysore Bonda with Chutney",
      isVegOnly: true,
      calories: "260 kcal",
    },
    {
      dayOfWeek: "Sunday",
      mealType: "DINNER",
      timing: "07:30 PM - 09:45 PM",
      items: "Missi Roti, Steamed Basmati Rice, Dal Bukhara, Kadai Paneer / Chicken Handi, Royal Rasmalai",
      specialItem: "Dal Bukhara & Royal Rasmalai",
      isVegOnly: false,
      calories: "810 kcal",
    },
  ],
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MessMenuPage() {
  const todayIndex = new Date().getDay(); // 0 is Sun
  const todayName = days[todayIndex === 0 ? 6 : todayIndex - 1];
  const [selectedDay, setSelectedDay] = useState<string>(todayName || "Friday");

  const meals = fullWeekMenu[selectedDay] || fullWeekMenu["Friday"];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              KIIT Central Mess System
            </Badge>
            <Badge variant="outline" className="text-xs">
              Campus 12 Dining Hall
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Hostel Mess Menu
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Weekly nutritional schedule approved by KIIT Student Mess Committee.
          </p>
        </div>

        <Link href="/dashboard/food-review">
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-600/20 text-xs">
            <Star className="size-4" />
            <span>Rate Today's Meal</span>
          </Button>
        </Link>
      </div>

      {/* 7-Day Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((day) => {
          const isToday = day === todayName;
          const isSelected = day === selectedDay;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30 scale-[1.02]"
                  : "bg-card/60 text-muted-foreground border-white/10 hover:border-emerald-500/30 hover:text-foreground"
              }`}
            >
              <CalendarDays className="size-3.5" />
              <span>{day}</span>
              {isToday && (
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-full ${isSelected ? "bg-white text-emerald-800" : "bg-emerald-500/20 text-emerald-400"}`}>
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Announcement Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-card/70 to-card/90 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <UtensilsCrossed className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Showing Menu for {selectedDay} {selectedDay === todayName ? "(Today)" : ""}
            </h3>
            <p className="text-xs text-muted-foreground">
              Vegetarian & Non-Vegetarian counters active. Unlimited salad, rice & rotis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full border-2 border-emerald-500 bg-emerald-500/20 flex items-center justify-center">
              <span className="size-1 rounded-full bg-emerald-500" />
            </span>
            <span className="text-muted-foreground">Veg Counter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full border-2 border-rose-500 bg-rose-500/20 flex items-center justify-center">
              <span className="size-1 rounded-full bg-rose-500" />
            </span>
            <span className="text-muted-foreground">Non-Veg Counter</span>
          </div>
        </div>
      </div>

      {/* 4 Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {meals.map((meal) => {
          let icon = <Coffee className="size-5 text-amber-400" />;
          let mealLabel = "Breakfast";
          if (meal.mealType === "LUNCH") {
            icon = <Soup className="size-5 text-emerald-400" />;
            mealLabel = "Lunch";
          } else if (meal.mealType === "SNACKS") {
            icon = <Coffee className="size-5 text-orange-400" />;
            mealLabel = "Evening Snacks & Chai";
          } else if (meal.mealType === "DINNER") {
            icon = <Flame className="size-5 text-purple-400" />;
            mealLabel = "Dinner";
          }

          return (
            <Card key={meal.mealType} className="bg-card/70 border-white/10 backdrop-blur-md hover:border-emerald-500/30 transition-all flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                      {icon}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">{mealLabel}</CardTitle>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="size-3 text-emerald-400" />
                        <span>{meal.timing}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {meal.isVegOnly ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                        100% Pure Veg
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-[10px]">
                        Veg & Non-Veg
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                      Menu Items
                    </span>
                    <p className="text-sm text-foreground leading-relaxed">
                      {meal.items}
                    </p>
                  </div>

                  {meal.specialItem && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2">
                      <Sparkles className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-semibold text-emerald-300">Today's Special: </span>
                        <span className="text-muted-foreground">{meal.specialItem}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Nutritional Value:</span>
                  <span className="font-mono font-medium text-emerald-400">{meal.calories}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mess Rules & Committee Info */}
      <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Building2 className="size-4 text-emerald-400" />
          <span>KIIT Mess Operations & Resident Guidelines</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-muted-foreground">
          <div className="p-3 rounded-xl bg-card/40 border border-white/5 space-y-1">
            <span className="font-bold text-foreground block">Timings Adherence</span>
            <p>Counters close strictly at scheduled timings. Late food packs can be pre-ordered from hostel office with genuine lab slip.</p>
          </div>
          <div className="p-3 rounded-xl bg-card/40 border border-white/5 space-y-1">
            <span className="font-bold text-foreground block">Hygiene Standards</span>
            <p>Mandatory sanitization before entering dining area. Outside food containers strictly prohibited in main hall.</p>
          </div>
          <div className="p-3 rounded-xl bg-card/40 border border-white/5 space-y-1">
            <span className="font-bold text-foreground block">Feedback & Committee</span>
            <p>Mess Committee representative conducts weekly inspections. Submit ratings directly in portal for prompt menu updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
