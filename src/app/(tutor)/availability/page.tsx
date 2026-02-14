"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AvailabilityPage() {
  const [slots, setSlots] = useState([
    { dayOfWeek: 1, startTime: "10:00", endTime: "12:00" },
  ]);

  const saveAvailability = async () => {
    await apiFetch("/api/tutors/availability", {
      method: "PUT",
      body: JSON.stringify({ slots }),
    });

    alert("Availability Updated");
  };

  return (
    <div>
      <button onClick={saveAvailability}>Save Availability</button>
    </div>
  );
}
