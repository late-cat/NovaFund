"use client";

import { useEffect, useState } from "react";
import CampaignCard from "@/components/CampaignCard";
import { Sparkles, ArrowRight, Loader2, Link2 } from "lucide-react";
import Link from "next/link";
import { getFactoryClient, getCampaignClient } from "@/lib/soroban";
import { fromStroops } from "@/lib/stellar/utils";
import { motion, Variants } from "framer-motion";

import { useCampaigns } from "@/hooks/useCampaigns";

export default function Home() {
  const { campaigns, loading } = useCampaigns(100);

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
      <section className="relative pt-16 pb-8 text-center max-w-3xl mx-auto flex flex-col items-center">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-medium text-xs tracking-wider mb-6">
          <Sparkles size={14} />
          <span>Soroban Smart Contracts</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-800">
          Fund the future on <br /> Stellar
        </motion.h1>

        <motion.p variants={itemVariants} className="text-gray-600 mb-8 max-w-lg leading-relaxed text-sm md:text-base">
          Launch your visionary projects with trustless, decentralized crowdfunding. Create campaigns, pledge securely, and claim funds automatically.
        </motion.p>

        <motion.div variants={itemVariants} className="flex gap-4">
          <Link
            href="/create"
            className="sticky-note-btn relative px-8 py-3 bg-[#fdf5c9] text-[#e88147] hover:bg-[#fbf1bb] font-bold transition-all flex items-center gap-2 text-sm hover:-rotate-2 group"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 w-8 h-3 bg-white/50 border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm rotate-[-4deg]" />
            Start a Campaign
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* Platform Statistics */}
      <motion.section variants={itemVariants} className="w-full flex justify-center mt-2 mb-4">
        <div 
          className="relative p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-around w-full max-w-2xl border border-gray-200/50 overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(249,250,251,0.9) 100%),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")
            `,
          }}
        >
          <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.02)] pointer-events-none z-0" />
          
          <div className="text-center px-4 relative z-10">
             <p className="text-3xl md:text-4xl font-bold text-gray-900 drop-shadow-sm">{loading ? "-" : campaigns.length}</p>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Projects Launched</p>
          </div>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-200 to-transparent relative z-10" />
          <div className="text-center px-4 relative z-10">
             <p className="text-3xl md:text-4xl font-bold text-gray-900 drop-shadow-sm">
               {loading ? "-" : campaigns.reduce((acc, c) => acc + Number(c.raised), 0).toLocaleString()} 
               <span className="text-lg md:text-xl text-gray-400 ml-1">XLM</span>
             </p>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total Volume Pledged</p>
          </div>
        </div>
      </motion.section>

      {/* Featured Campaigns */}
      <motion.section variants={itemVariants} className="mt-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#e88147] text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Link2 size={14} />
              <span className="text-sm font-bold tracking-wide">Latest Projects</span>
            </div>
          </div>
          <Link href="/explore" className="text-gray-500 hover:text-orange-500 font-medium flex items-center gap-1 transition-colors text-xs">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-orange-400" size={32} />
          </div>
        ) : campaigns.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 -mx-6 px-6 md:grid md:grid-cols-3 md:items-start md:overflow-visible md:snap-none md:pb-0 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {campaigns.slice(0, 6).map((campaign) => (
              <motion.div key={campaign.id} variants={itemVariants} className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-auto">
                <CampaignCard {...campaign} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-white/60 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-3 text-sm">No campaigns found on the network.</p>
            <Link
              href="/create"
              className="text-[#e88147] hover:text-[#d6723b] font-medium underline underline-offset-4 text-sm"
            >
              Be the first to create one
            </Link>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
