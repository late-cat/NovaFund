"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export default function EventsTicker() {
  const [events, setEvents] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    // In a production environment, this would use Stellar SDK's server.events().stream()
    // to listen for "pledge" and "campaign_created" events from our deployed contracts.
    
    // For demo purposes, we simulate real-time network events
    const mockEvents = [
      "New Campaign Launched: Soroban Auditing Tool",
      "Wallet GBXV...Q9L just pledged 5,000 XLM",
      "DeSci DAO just reached 89% of its funding goal!",
      "Campaign Goal Met: DeFi Protocol",
    ];

    let i = 0;
    const interval = setInterval(() => {
      setEvents((prev) => {
        const newEvent = { id: Date.now().toString(), text: mockEvents[i % mockEvents.length] };
        i++;
        return [newEvent, ...prev].slice(0, 3); // Keep only latest 3
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      {events.map((event) => (
        <div 
          key={event.id}
          className="flex items-center gap-3 bg-[#0f111a]/80 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl shadow-2xl animate-slide-up"
        >
          <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-1.5 rounded-full">
            <Bell size={14} className="text-white" />
          </div>
          <span className="text-sm font-medium text-gray-200">{event.text}</span>
        </div>
      ))}
    </div>
  );
}
