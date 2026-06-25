"use client";

import { useEffect, useState } from "react";
import CampaignCard from "@/components/CampaignCard";
import { Sparkles, ArrowRight, Loader2, Link2 } from "lucide-react";
import Link from "next/link";
import { getFactoryClient, getCampaignClient } from "@/lib/soroban";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const factory = getFactoryClient();
        const { result } = await factory.get_campaigns();
        
        if (result) {
          const campaignIds = result;
          
          const campaignPromises = campaignIds.map(async (id: string) => {
            const campaign = getCampaignClient(id);
            try {
              const { result: stateResult } = await campaign.get_state();
              if (stateResult) {
                const state = stateResult;
                
                const goalNum = Number(state.goal) / 10000000;
                const raisedNum = Number(state.current_amount) / 10000000;
                
                const mockImages = [
                  "https://images.unsplash.com/photo-1639762681485-074b7f4f40e6?auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80"
                ];
                const charCode = id.charCodeAt(0) || 0;
                const image = mockImages[charCode % mockImages.length];
                
                const deadlineDate = new Date(Number(state.deadline) * 1000).toISOString().split("T")[0];

                const professionalTitles = [
                  "Eco-Friendly Urban Farming",
                  "Next-Gen VR Education App",
                  "Community Solar Grid Project",
                  "Open Source AI Research",
                  "Decentralized Finance Protocol",
                  "Clean Water Initiative"
                ];
                const professionalDescriptions = [
                  "Help us build sustainable, vertical farming solutions for dense urban environments to reduce carbon footprints and provide fresh produce.",
                  "We are developing a cutting-edge virtual reality application that makes complex subjects like physics and chemistry intuitive for students.",
                  "A community-driven initiative to install solar panels on neighborhood rooftops, drastically reducing energy costs and reliance on fossil fuels.",
                  "Funding independent researchers to build transparent, accessible, and open-source artificial intelligence models for the public good.",
                  "A next-generation DeFi protocol built entirely on Soroban, enabling trustless, low-fee lending and borrowing across the Stellar network.",
                  "Providing advanced water filtration systems to remote communities, ensuring access to clean and safe drinking water for everyone."
                ];

                let metaTitle = professionalTitles[charCode % professionalTitles.length];
                let metaImage = mockImages[charCode % mockImages.length];
                let metaDesc = professionalDescriptions[charCode % professionalDescriptions.length];
                
                try {
                  const stored = localStorage.getItem(`campaign_meta_${id}`);
                  if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.title) metaTitle = parsed.title;
                    if (parsed.image) metaImage = parsed.image;
                    if (parsed.description) metaDesc = parsed.description;
                  }
                } catch (e) {
                  console.error("Failed to parse metadata", e);
                }

                return {
                  id,
                  title: metaTitle,
                  description: metaDesc,
                  creator: `${state.creator.slice(0, 4)}...${state.creator.slice(-4)}`,
                  goal: goalNum,
                  raised: raisedNum,
                  deadline: deadlineDate,
                  image: metaImage,
                };
              }
            } catch (err) {
              console.error("Error fetching state for campaign", id, err);
            }
            return null;
          });

          const resolved = await Promise.all(campaignPromises);
          const validCampaigns = resolved.filter((c: any) => c !== null);
          setCampaigns(validCampaigns.reverse());
        }
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

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
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
          >
            {campaigns.slice(0, 6).map((campaign) => (
              <motion.div key={campaign.id} variants={itemVariants}>
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
