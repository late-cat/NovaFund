import React from 'react';
import { ArrowRight } from 'lucide-react';

const mockPledges = [
  { id: 1, amount: 442, to: "KIMIA-AI", time: "1h ago", address: "GAYP...K6KA" },
  { id: 2, amount: 100, to: "Stellar DEX", time: "2h ago", address: "GDFR...P3LW" },
  { id: 3, amount: 50, to: "Nova Yield", time: "3h ago", address: "GBNM...2LQX" },
  { id: 4, amount: 1500, to: "KIMIA-AI", time: "4h ago", address: "GCHJ...9MNO" },
  { id: 5, amount: 350, to: "Basket", time: "5h ago", address: "GKLM...1XYZ" },
  { id: 6, amount: 25, to: "Mycorealms", time: "6h ago", address: "GOPQ...RSTU" },
  { id: 7, amount: 800, to: "Stellar DEX", time: "1d ago", address: "GVWX...YZAB" },
  { id: 8, amount: 120, to: "Nova Yield", time: "1d ago", address: "GCDE...FGHI" },
];

export default function Ticker() {
  return (
    <div className="w-full bg-[#111316] text-white overflow-hidden flex items-center h-10 border-b border-[#2a2d35] shadow-sm">
      <div className="flex items-center gap-3 px-4 bg-[#111316] z-10 h-full shadow-[5px_0_10px_-5px_#111316]">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[11px] font-bold tracking-widest text-blue-400 uppercase">Live</span>
      </div>
      
      <div className="relative flex overflow-x-hidden flex-1 group">
        <div className="flex items-center whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
          {[...mockPledges, ...mockPledges, ...mockPledges, ...mockPledges].map((pledge, index) => (
            <div key={`${pledge.id}-${index}`} className="flex items-center text-xs text-gray-400 mx-6 transition-colors hover:text-gray-200">
              <span className="font-mono text-gray-500">{pledge.address}</span>
              <ArrowRight size={12} className="mx-2 text-gray-600" />
              <span className="font-bold text-green-400 mr-1">{pledge.amount} XLM</span>
              <span>to <span className="text-white font-medium">{pledge.to}</span></span>
              <span className="ml-2 text-[10px] text-gray-600">{pledge.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
