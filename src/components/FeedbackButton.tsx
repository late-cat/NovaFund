"use client";

import { MessageSquarePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FeedbackButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Show button after a small delay
    const showTimer = setTimeout(() => setIsVisible(true), 1500);
    
    // Auto-collapse into a small icon after 5 seconds
    const collapseTimer = setTimeout(() => setIsExpanded(false), 5000);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(collapseTimer);
    };
  }, []);

  const handleClick = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSfTpOUdr3LiZeptohHgR6_YX0gLMQhNB4Uup9u3NsegC8GVDQ/viewform?usp=header", "_blank");
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center bg-white/80 backdrop-blur-md border border-gray-200 hover:border-[#e88147]/50 hover:bg-white text-[#e88147] p-3 sm:px-4 sm:py-3 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_10px_25px_rgba(232,129,71,0.25),inset_0_1px_1px_rgba(255,255,255,1)] transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
      aria-label="Share Feedback"
    >
      {/* Subtle Paper Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />
      
      <MessageSquarePlus className="w-6 h-6 sm:w-5 sm:h-5 shrink-0 relative z-10" />
      <div 
        className={`font-medium font-outfit whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out relative z-10 ${
          isExpanded 
            ? "max-w-[200px] opacity-100 ml-2" 
            : "max-w-0 opacity-0 ml-0 hidden sm:block sm:group-hover:max-w-[200px] sm:group-hover:opacity-100 sm:group-hover:ml-2"
        }`}
      >
        Share Feedback
      </div>
    </button>
  );
}
