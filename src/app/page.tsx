"use client";

import { useEffect, useState } from "react";
import CampaignCard from "@/components/CampaignCard";
import { Sparkles, ArrowRight, Loader2, Link2 } from "lucide-react";
import Link from "next/link";
import { getFactoryClient, getCampaignClient } from "@/lib/soroban";
import { fromStroops } from "@/lib/stellar/utils";
import { motion, Variants } from "framer-motion";
import * as Sentry from "@sentry/nextjs";

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
        <motion.button 
          variants={itemVariants} 
          onClick={() => { Sentry.captureException(new Error("Sentry Test Error from User!")); alert("Silent error sent to Sentry!"); }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-medium text-xs tracking-wider mb-6 hover:bg-orange-200 transition-colors"
        >
          <Sparkles size={14} />
          <span>Soroban Smart Contracts</span>
        </motion.button>

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
