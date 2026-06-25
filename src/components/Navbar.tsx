"use client";

import WalletConnect from "./WalletConnect";
import { TreePine } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 50], [0, 1]);
  const blur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 0.1]);

  return (
    <nav className="sticky top-0 z-50 w-full h-16">
      <motion.div 
        className="absolute inset-0 bg-white/70" 
        style={{ opacity, filter: blur, borderBottom: "1px solid rgba(0,0,0,var(--border-opacity))" }}
      />
      <div className="relative h-full max-w-5xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <TreePine size={24} className="text-gray-800" />
          <span className="text-lg font-bold text-gray-800 tracking-tight">
            NovaFund
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/create"
              className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
            >
              Start Campaign
            </Link>
          </div>
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
