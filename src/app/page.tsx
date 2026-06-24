import CampaignCard from "@/components/CampaignCard";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // Mock data for display purposes
  const campaigns = [
    {
      id: "1",
      title: "DeFi Protocol for Stellar Liquidity",
      creator: "GBXV...Q9L",
      goal: 50000,
      raised: 35000,
      deadline: "2026-08-01",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f4f40e6?auto=format&fit=crop&q=80",
    },
    {
      id: "2",
      title: "Soroban Smart Contract Auditing Tool",
      creator: "GDJ9...K1P",
      goal: 25000,
      raised: 12000,
      deadline: "2026-07-15",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80",
    },
    {
      id: "3",
      title: "Decentralized Science (DeSci) DAO",
      creator: "GCL7...N4M",
      goal: 100000,
      raised: 89000,
      deadline: "2026-09-30",
      image:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium text-sm mb-8 animate-fade-in">
          <Sparkles size={16} />
          <span>Powered by Soroban Smart Contracts</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
          Fund the future on <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
            Stellar Network
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
          Launch your visionary projects with trustless, decentralized crowdfunding. Create
          campaigns, pledge securely, and claim funds automatically when goals are met.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/create"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-purple-500/25 transition-all hover:scale-105 flex items-center gap-2"
          >
            Start a Campaign
            <ArrowRight size={20} />
          </Link>
          <button className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition-all hover:scale-105">
            Explore Projects
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 glass-panel p-8 rounded-3xl">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">$2.4M+</div>
          <div className="text-sm font-medium text-gray-400">Total Funded</div>
        </div>
        <div className="text-center border-l border-white/5">
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">156</div>
          <div className="text-sm font-medium text-gray-400">Projects Launched</div>
        </div>
        <div className="text-center border-l border-white/5">
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">12.5k</div>
          <div className="text-sm font-medium text-gray-400">Total Backers</div>
        </div>
        <div className="text-center border-l border-white/5">
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
          <div className="text-sm font-medium text-gray-400">On-chain Verifiable</div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="mt-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-3">Trending Campaigns</h2>
            <p className="text-gray-400">
              Discover the most innovative projects building on Stellar.
            </p>
          </div>
          <button className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-2 transition-colors">
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} {...campaign} />
          ))}
        </div>
      </section>
    </div>
  );
}
