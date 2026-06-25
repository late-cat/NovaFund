"use client";

import { useState } from "react";
import { TreePine, Calendar, Target, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CreateCampaign() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    deadline: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { requestAccess, signTransaction } = await import("@stellar/freighter-api");
      const { address } = await requestAccess();
      if (!address) {
        alert("Please connect your Freighter wallet first.");
        setIsLoading(false);
        return;
      }

      const { getFactoryClient } = await import("@/lib/soroban");
      const client = getFactoryClient();

      const salt = new Uint8Array(32);
      crypto.getRandomValues(salt);

      const deadlineDate = new Date(formData.deadline);
      deadlineDate.setUTCHours(23, 59, 59, 999);
      const deadlineSecs = Math.floor(deadlineDate.getTime() / 1000);
      const goalAmount = BigInt(formData.goal) * BigInt(10000000);

      const tokenAddress = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

      const tx = await client.create_campaign({
        creator: address,
        token: tokenAddress,
        goal: goalAmount,
        deadline: BigInt(deadlineSecs),
        salt: Buffer.from(salt),
      }, { publicKey: address });

      const sentTx = await tx.signAndSend({ signTransaction });
      
      const newCampaignId = sentTx.result;
      console.log("Campaign created!", newCampaignId);
      
      if (typeof newCampaignId === 'string') {
        const metadata = {
          title: formData.title,
          description: formData.description,
          image: formData.image,
        };
        localStorage.setItem(`campaign_meta_${newCampaignId}`, JSON.stringify(metadata));
      }

      setTimeout(() => {
        setIsLoading(false);
        router.push("/");
      }, 1500);
    } catch (e) {
      console.error(e);
      alert("Error deploying campaign: " + e);
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <motion.div 
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 mb-4 shadow-sm text-orange-500">
            <TreePine size={24} />
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight text-gray-800">Start a Campaign</h1>
          <p className="text-gray-500 text-sm max-w-md">
            Deploy your idea to the Stellar testnet as an unstoppable Soroban smart contract.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/80 p-8 rounded-[2rem] shadow-sm border border-gray-100 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Campaign Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Next-Gen Stellar Wallet"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm shadow-inner"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Description</label>
              <textarea
                required
                rows={4}
                placeholder="Describe what you are building..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all resize-none text-sm shadow-inner"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Funding Goal (XLM)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Target size={16} className="text-gray-400" />
                  </div>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="10000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm shadow-inner"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Deadline</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    required
                    type="date"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm shadow-inner"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Cover Image URL</label>
              <input
                required
                type="url"
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm shadow-inner"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="sticky-note-btn relative w-full flex items-center justify-center gap-2 py-3.5 rounded-md font-bold transition-all text-sm border-none group bg-[#fdf5c9] text-[#e88147] hover:bg-[#fbf1bb] hover:-rotate-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 w-10 h-3.5 bg-white/50 border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm rotate-[2deg]" />
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-[#e88147]" />
                    <span>Deploying Smart Contract...</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Launch Campaign
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-3 font-medium">
                Deploying this contract will require a signature from your Freighter wallet.
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
