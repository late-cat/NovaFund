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
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#fdf5c9] text-[#b85c27] hover:text-[#d35400] font-bold transition-all text-[13px] hover:-rotate-2 shadow-[0_4px_15px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.15),0_8px_10px_-5px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)] rounded-[2px]"
          >
            {/* Subtle Paper Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-50 mix-blend-multiply pointer-events-none rounded-[2px]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />
            
            {/* Realistic Tape on top */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-30 w-10 h-3.5 bg-white/40 border border-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-md rotate-[-3deg] rounded-[1px]" />
            
            {/* Bottom shadow curl for 3D depth */}
            <div className="absolute bottom-1 left-4 right-4 h-3 -z-10 shadow-[0_6px_10px_rgba(0,0,0,0.18)] rounded-full group-hover:shadow-[0_12px_15px_rgba(0,0,0,0.15)] transition-shadow duration-300" />
            
            <span 
              className="relative z-10 tracking-widest uppercase"
              style={{ textShadow: "0 1px 1px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.25)" }}
            >
              Start a Campaign
            </span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" style={{ filter: "drop-shadow(0 1px 1px rgba(255,255,255,0.8)) drop-shadow(0 -1px 1px rgba(0,0,0,0.25))" }} />
          </Link>
        </motion.div>
      </section>

      {/* Platform Statistics */}
      <motion.section variants={itemVariants} className="w-full flex justify-center mt-2 mb-4">
        <div 
          className="relative p-6 rounded-[2rem] shadow-[0_12px_30px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.03)] flex items-center justify-around w-full max-w-2xl border border-gray-200/80 overflow-hidden"
          style={{
            backgroundColor: "#ffffff",
            backgroundImage: `
              url("https://www.transparenttextures.com/patterns/cream-paper.png"),
              linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,249,250,0.95) 100%)
            `,
          }}
        >
          {/* Subtle inner bevel to make it look thick */}
          <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_2px_4px_rgba(255,255,255,1),inset_0_-1px_3px_rgba(0,0,0,0.04)] pointer-events-none z-0" />
          
          {/* Left Screw (Hyper-realistic Phillips) */}
          <div className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full z-10 flex items-center justify-center shadow-[0_3px_5px_rgba(0,0,0,0.25),inset_0_-2px_4px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.9)] border border-[#888]"
               style={{
                 background: "conic-gradient(from 180deg at 50% 50%, #9ca3af 0deg, #f3f4f6 60deg, #9ca3af 120deg, #4b5563 180deg, #9ca3af 240deg, #f3f4f6 300deg, #9ca3af 360deg)",
                 transform: "rotate(25deg)"
               }}>
             <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)" }} />
             {/* Phillips cross recess */}
             <div className="relative w-[11px] h-[11px] z-10 rotate-45">
                <div className="absolute top-1/2 left-0 right-0 h-[2.5px] -translate-y-1/2 bg-[#1a1a1a] shadow-[0_1px_1px_rgba(255,255,255,0.8)] rounded-[1px]" />
                <div className="absolute left-1/2 top-0 bottom-0 w-[2.5px] -translate-x-1/2 bg-[#1a1a1a] shadow-[1px_0_1px_rgba(255,255,255,0.8)] rounded-[1px]" />
                <div className="absolute left-1/2 top-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-[#111] rounded-full shadow-[inset_0_2px_3px_rgba(0,0,0,1)]" />
             </div>
          </div>

          {/* Right Screw (Hyper-realistic Phillips) */}
          <div className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full z-10 flex items-center justify-center shadow-[0_3px_5px_rgba(0,0,0,0.25),inset_0_-2px_4px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.9)] border border-[#888]"
               style={{
                 background: "conic-gradient(from 180deg at 50% 50%, #9ca3af 0deg, #f3f4f6 60deg, #9ca3af 120deg, #4b5563 180deg, #9ca3af 240deg, #f3f4f6 300deg, #9ca3af 360deg)",
                 transform: "rotate(-15deg)"
               }}>
             <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)" }} />
             {/* Phillips cross recess */}
             <div className="relative w-[11px] h-[11px] z-10 rotate-45">
                <div className="absolute top-1/2 left-0 right-0 h-[2.5px] -translate-y-1/2 bg-[#1a1a1a] shadow-[0_1px_1px_rgba(255,255,255,0.8)] rounded-[1px]" />
                <div className="absolute left-1/2 top-0 bottom-0 w-[2.5px] -translate-x-1/2 bg-[#1a1a1a] shadow-[1px_0_1px_rgba(255,255,255,0.8)] rounded-[1px]" />
                <div className="absolute left-1/2 top-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-[#111] rounded-full shadow-[inset_0_2px_3px_rgba(0,0,0,1)]" />
             </div>
          </div>
          
          <div className="text-center px-4 relative z-10">
             <p 
               className="text-3xl md:text-4xl font-bold text-gray-800"
               style={{ textShadow: "0 1px 1px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.25)" }}
             >
               {loading ? "-" : campaigns.length}
             </p>
             <p 
               className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1"
               style={{ textShadow: "0 1px 1px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.25)" }}
             >
               Projects Launched
             </p>
          </div>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent relative z-10" />
          <div className="text-center px-4 relative z-10">
             <p 
               className="text-3xl md:text-4xl font-bold text-gray-800"
               style={{ textShadow: "0 1px 1px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.25)" }}
             >
               {loading ? "-" : campaigns.reduce((acc, c) => acc + Number(c.raised), 0).toLocaleString()} 
               <span className="text-lg md:text-xl text-gray-500 ml-1">XLM</span>
             </p>
             <p 
               className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1"
               style={{ textShadow: "0 1px 1px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.25)" }}
             >
               Total Volume Pledged
             </p>
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
          <Link href="/explore" className="group flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-orange-500 transition-all uppercase tracking-widest bg-white/80 backdrop-blur hover:bg-orange-50 px-4 py-1.5 rounded-full border border-gray-200 hover:border-orange-200 shadow-sm hover:shadow">
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
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
