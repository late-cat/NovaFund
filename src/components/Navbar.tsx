"use client";

import { useState } from "react";
import WalletConnect from "./WalletConnect";
import { TreePine, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 50], [0, 1]);
  const blur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 0.1]);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full h-16">
        <motion.div 
          className="absolute inset-0 bg-white/70" 
          style={{ opacity, filter: blur, borderBottom: "1px solid rgba(0,0,0,var(--border-opacity))" }}
        />
        <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <TreePine size={24} className="text-gray-800" />
            <span className="text-lg font-bold text-gray-800 tracking-tight">
              NovaFund
            </span>
          </Link>
          
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/explore"
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
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden flex items-center p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 bg-white border-b border-gray-100 shadow-lg md:hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              <Link
                href="/explore"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-gray-700 hover:text-orange-500 transition-colors px-4 py-2 bg-gray-50 rounded-lg"
              >
                Explore Campaigns
              </Link>
              <Link
                href="/create"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-gray-700 hover:text-orange-500 transition-colors px-4 py-2 bg-gray-50 rounded-lg"
              >
                Start Campaign
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
