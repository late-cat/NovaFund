"use client";

import { MessageSquarePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FeedbackButton() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show after a small delay for a smooth entrance
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    // Placeholder Google Form URL - the user will replace this later
    window.open("https://docs.google.com/forms/d/placeholder/viewform", "_blank");
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] transition-all duration-300 hover:-translate-y-1 group"
      aria-label="Share Feedback"
    >
      <MessageSquarePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="font-medium font-outfit hidden sm:block">Share Feedback</span>
    </button>
  );
}
