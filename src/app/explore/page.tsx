"use client";

import { useEffect, useState } from "react";
import CampaignCard from "@/components/CampaignCard";
import CampaignListRow from "@/components/CampaignListRow";
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Link2, Search, LayoutGrid, List as ListIcon } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useCampaigns } from "@/hooks/useCampaigns";

export default function Explore() {
  const { campaigns, loading } = useCampaigns(100);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="flex flex-col gap-12 pb-20 font-sans"
    >
      <section className="mt-8 w-full">
        <Link href="/" className="group inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur border border-gray-200 rounded-full text-gray-500 hover:text-[#e88147] hover:border-[#e88147]/30 hover:bg-orange-50 mb-8 transition-all font-bold text-[11px] tracking-widest uppercase shadow-sm hover:shadow">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" /> Back to Home
        </Link>
        
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#e88147] text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
              <Link2 size={16} />
              <span className="text-sm font-bold tracking-wide">All Campaigns</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Search size={16} className="text-gray-400 group-focus-within:text-[#e88147] transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#e88147]/50 focus:ring-4 focus:ring-[#e88147]/10 transition-all placeholder:text-gray-400 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)] hover:border-gray-300"
              />
            </div>
            
            <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-full transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-full transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
                title="List View"
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-orange-400" size={32} />
          </div>
        ) : filteredCampaigns.length > 0 ? (
          viewMode === "grid" ? (
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5"
            >
              {filteredCampaigns.map((campaign) => (
                <motion.div key={campaign.id} variants={itemVariants}>
                  <CampaignCard {...campaign} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              className="flex flex-col w-full"
            >
              {filteredCampaigns.map((campaign) => (
                <motion.div key={campaign.id} variants={itemVariants} className="w-full">
                  <CampaignListRow {...campaign} />
                </motion.div>
              ))}
            </motion.div>
          )
        ) : (
          <div className="text-center py-16 bg-white/60 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-3 text-sm">No campaigns match your search.</p>
            <Link
              href="/create"
              className="text-[#e88147] hover:text-[#d6723b] font-medium underline underline-offset-4 text-sm"
            >
              Be the first to create one
            </Link>
          </div>
        )}
      </section>
    </motion.div>
  );
}
