import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockCourts, type Court } from "../data/mockData";

interface CourtsContextType {
   courts: Court[];
   addCourt: (court: Court) => void;
   updateCourt: (id: string, updates: Partial<Court>) => void;
   deleteCourt: (id: string) => void;
   approveCourt: (id: string) => void;
   rejectCourt: (id: string, reason: string) => void;
}

const CourtsContext = createContext<CourtsContextType | undefined>(undefined);

export function CourtsProvider({ children }: { children: ReactNode }) {
   const [courts, setCourts] = useState<Court[]>(() => {
      // Try to load from localStorage
      const saved = localStorage.getItem("courts_data");
      if (saved) {
         try {
            return JSON.parse(saved);
         } catch (e) {
            console.error("Error parsing courts data:", e);
         }
      }

      // Add some pending courts for demo
      const pendingCourts: Court[] = [
         {
            id: "pending-1",
            code: "PB03",
            name: "Sân Pickleball Thủ Đức",
            type: "pickleball",
            area: "Thủ Đức",
            address: "999 Xa Lộ Hà Nội, Thủ Đức, TP.HCM",
            description: "Sân pickleball mới xây với 4 sân chuẩn quốc tế",
            images: ["https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800"],
            facilities: ["Bãi đỗ xe", "Phòng thay đồ", "Wifi", "Nước uống"],
            pricing: { morning: 120000, afternoon: 150000, evening: 200000 },
            rating: 0,
            reviewCount: 0,
            capacity: 8,
            openingHours: "06:00 - 22:00",
            status: "active",
            owner: "Nguyễn Văn Chủ Sân",
            ownerId: "owner-1",
            approvalStatus: "pending",
            submittedAt: "2026-03-25T09:00:00",
         },
         {
            id: "pending-2",
            code: "CL04",
            name: "Sân Cầu Lông Gò Vấp",
            type: "badminton",
            area: "Gò Vấp",
            address: "222 Quang Trung, Gò Vấp, TP.HCM",
            description: "Sân cầu lông 6 sân trong nhà, điều hòa",
            images: ["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"],
            facilities: ["Điều hòa", "Bãi đỗ xe", "Phòng tắm", "Căng tin"],
            pricing: { morning: 80000, afternoon: 100000, evening: 140000 },
            rating: 0,
            reviewCount: 0,
            capacity: 4,
            openingHours: "06:00 - 23:00",
            status: "active",
            owner: "Nguyễn Văn Chủ Sân",
            ownerId: "owner-1",
            approvalStatus: "pending",
            submittedAt: "2026-03-26T14:30:00",
         },
      ];

      return [...pendingCourts, ...mockCourts];
   });

   // Save to localStorage whenever courts change
   useEffect(() => {
      localStorage.setItem("courts_data", JSON.stringify(courts));
   }, [courts]);

   const addCourt = (court: Court) => {
      setCourts((prev) => [court, ...prev]);
   };

   const updateCourt = (id: string, updates: Partial<Court>) => {
      setCourts((prev) =>
         prev.map((court) => (court.id === id ? { ...court, ...updates } : court))
      );
   };

   const deleteCourt = (id: string) => {
      setCourts((prev) => prev.filter((court) => court.id !== id));
   };

   const approveCourt = (id: string) => {
      setCourts((prev) =>
         prev.map((court) =>
            court.id === id
               ? {
                  ...court,
                  approvalStatus: "approved" as const,
                  approvedAt: new Date().toISOString(),
                  approvedBy: "Admin",
               }
               : court
         )
      );
   };

   const rejectCourt = (id: string, reason: string) => {
      setCourts((prev) =>
         prev.map((court) =>
            court.id === id
               ? {
                  ...court,
                  approvalStatus: "rejected" as const,
                  rejectionReason: reason,
                  rejectedAt: new Date().toISOString(),
               }
               : court
         )
      );
   };

   return (
      <CourtsContext.Provider
         value={{
            courts,
            addCourt,
            updateCourt,
            deleteCourt,
            approveCourt,
            rejectCourt,
         }}
      >
         {children}
      </CourtsContext.Provider>
   );
}

export function useCourts() {
   const context = useContext(CourtsContext);
   if (context === undefined) {
      throw new Error("useCourts must be used within a CourtsProvider");
   }
   return context;
}
