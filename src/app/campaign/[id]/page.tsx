"use client";

import { useEffect, useState, use } from "react";
import { getCampaignClient } from "@/lib/soroban";
import { Loader2, ArrowLeft, ArrowRight, Target, Clock, User, Coins } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CampaignDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [isPledging, setIsPledging] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const client = getCampaignClient(id);
        const { result: stateResult } = await client.get_state();
        
        if (stateResult) {
          const state = stateResult;
          const goalNum = Number(state.goal) / 10000000;
          const raisedNum = Number(state.current_amount) / 10000000;
          const deadlineDate = new Date(Number(state.deadline) * 1000).toLocaleString();
          
          const mockImages = [
            "https://images.unsplash.com/photo-1639762681485-074b7f4f40e6?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80"
          ];
          const charCode = id.charCodeAt(0) || 0;
          const image = mockImages[charCode % mockImages.length];
          let metaTitle = `Campaign ${id.slice(0, 6)}`;
          let metaImage = mockImages[charCode % mockImages.length];
          let metaDesc = "";
          
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

          setCampaign({
            id,
            title: metaTitle,
            description: metaDesc,
            creator: state.creator,
            goal: goalNum,
            raised: raisedNum,
            deadline: deadlineDate,
            deadlineSecs: Number(state.deadline),
            image: metaImage,
          });
        }
      } catch (err) {
        console.error("Failed to fetch campaign details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handlePledge = async () => {
    if (!pledgeAmount || isNaN(Number(pledgeAmount))) return;
    setIsPledging(true);

    try {
      const { requestAccess, signTransaction } = await import("@stellar/freighter-api");
      const { address } = await requestAccess();
      if (!address) {
        alert("Please connect your Freighter wallet first.");
        setIsPledging(false);
        return;
      }

      const client = getCampaignClient(id);
      const amountInStroops = BigInt(Number(pledgeAmount) * 10000000);
      
      const tx = await client.pledge({
        backer: address,
        amount: amountInStroops,
      }, { publicKey: address });

      const sentTx = await tx.signAndSend({ signTransaction });
      console.log("Pledge successful!", sentTx);
      
      const txHash = (sentTx as any).sendTransactionResponse?.hash || (sentTx as any).getTransactionResponse?.hash;
      if (txHash) {
        setSuccessTxHash(txHash);
      } else {
        alert("Pledge successful!");
        window.location.reload();
      }
    } catch (e: any) {
      const errorMessage = e?.message || String(e);
      
      if (errorMessage.includes("resulting balance is not within the allowed range") || errorMessage.includes("Error(Contract, #10)")) {
        alert("Pledge failed: You do not have enough available XLM in your wallet. Please note that some of your XLM might be locked in network reserves.");
      } else if (errorMessage.includes("User declined")) {
        alert("Transaction was rejected in the wallet.");
      } else {
        alert(`Error pledging: ${errorMessage}`);
      }
    } finally {
      setIsPledging(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="animate-spin text-orange-400" size={40} />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-bold text-gray-800">Campaign not found</h2>
        <Link href="/" className="text-orange-500 hover:underline mt-4 inline-block">Back to Explore</Link>
      </div>
    );
  }

  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const isEnded = Math.floor(Date.now() / 1000) > campaign.deadlineSecs;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8 px-6"
    >
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-8 transition-colors font-medium text-sm">
        <ArrowLeft size={16} /> Back to Projects
      </Link>
      
      <div className="bg-white/90 rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden backdrop-blur-sm">
        <div className="w-full h-64 md:h-80 relative">
          <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="px-8 pb-10 relative -mt-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">{campaign.title}</h1>
          {campaign.description && (
            <p className="text-gray-600 mb-4 max-w-2xl">{campaign.description}</p>
          )}
          
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-8 bg-gray-50 inline-flex px-4 py-2 rounded-full border border-gray-100">
            <User size={16} className="text-orange-400" />
            <span>By <span className="font-medium text-gray-700">{campaign.creator.slice(0, 8)}...{campaign.creator.slice(-8)}</span></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-3xl font-bold text-gray-900">{campaign.raised} <span className="text-lg text-gray-500 font-medium">XLM</span></div>
                  <div className="text-orange-500 font-bold">{progress.toFixed(1)}%</div>
                </div>
                
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden my-4">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <Target size={16} />
                  <span>Goal: {campaign.goal} XLM</span>
                </div>
              </div>

              <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100/50 flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-orange-500">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deadline</p>
                  <p className="text-gray-900 font-medium">{campaign.deadline}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Support this project</h3>
              <p className="text-sm text-gray-500 mb-6">Enter an amount in XLM to pledge towards the campaign goal.</p>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Coins size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Amount (XLM)"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm shadow-inner"
                    value={pledgeAmount}
                    onChange={(e) => setPledgeAmount(e.target.value)}
                  />
                </div>

                <button
                  onClick={handlePledge}
                  disabled={isPledging || !pledgeAmount || isEnded}
                  className={`sticky-note-btn relative w-full flex items-center justify-center gap-2 py-3.5 rounded-md font-bold transition-all text-sm border-none group ${
                    isEnded 
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#fdf5c9] text-[#e88147] hover:bg-[#fbf1bb] hover:-rotate-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 w-10 h-3.5 bg-white/50 border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm rotate-[-3deg]" />
                  {isPledging ? (
                    <Loader2 size={18} className="animate-spin text-[#e88147]" />
                  ) : null}
                  {isEnded ? "Campaign Ended" : isPledging ? "Pledging..." : "Pledge XLM"}
                </button>
                {successTxHash && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, rotate: -5 }}
                    animate={{ opacity: 1, y: 0, rotate: 2 }}
                    className="mt-6 sticky-note relative p-4 bg-[#e6f4ea] text-[#2e653a] text-center shadow-[2px_4px_12px_rgba(0,0,0,0.05)] border-none"
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 w-10 h-3.5 bg-white/50 border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm rotate-[4deg]" />
                    <p className="font-bold text-sm mb-3">🎉 Pledge Successful!</p>
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${successTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#d1e8d8] hover:bg-[#c1dfc9] transition-colors rounded-sm text-xs font-bold text-[#1f4a28] shadow-sm group"
                    >
                      View Transaction History <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
