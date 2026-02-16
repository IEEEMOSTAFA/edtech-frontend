"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
type AvailabilitySlot = {
  dayOfWeek: number;   // 0–6
  startTime: string;   // "09:00"
  endTime: string;     // "17:00"
  isAvailable?: boolean;
};

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);

  const handleSubmit = async () => {
    await apiFetch("/api/tutors/availability", {
      method: "PUT",
      body: JSON.stringify({ slots }),
    });

    alert("Availability updated");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Set Availability</h1>

      <button
        onClick={() =>
          setSlots([
            ...slots,
            {
              dayOfWeek: 1,
              startTime: "09:00",
              endTime: "12:00",
            },
          ])
        }
      >
        Add Slot
      </button>

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

















// "use client";

// import { useState } from "react";
// import { apiFetch } from "@/lib/api";

// export default function AvailabilityPage() {
//   const [slots, setSlots] = useState([
//     { dayOfWeek: 1, startTime: "10:00", endTime: "12:00" },
//   ]);

//   const saveAvailability = async () => {
//     await apiFetch("/api/tutors/availability", {
//       method: "PUT",
//       body: JSON.stringify({ slots }),
//     });

//     alert("Availability Updated");
//   };

//   return (
//     <div>
//       <button onClick={saveAvailability}>Save Availability</button>
//     </div>
//   );
// }
