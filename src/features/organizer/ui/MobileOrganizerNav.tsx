"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { OrganizerSidebar } from "./OrganizerSidebar";

export function MobileOrganizerNav({ isAdmin }: { isAdmin: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 rounded-xl hover:bg-secondary/50">
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative z-50 h-full w-4/5 max-w-sm bg-background shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 p-2 rounded-xl bg-secondary/50 z-50">
              <X size={20} />
            </button>
            <div className="h-full overflow-y-auto" onClick={() => setIsOpen(false)}>
              <OrganizerSidebar isAdmin={isAdmin} className="flex w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
