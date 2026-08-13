"use client";

import { useEffect, useState, use } from "react";
import { getCampaignClient } from "@/lib/soroban";
import { fromStroops, toStroops, fetchBalance } from "@/lib/stellar/utils";
import { Loader2, ArrowLeft, ArrowRight, Target, Clock, User, Coins } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { useCampaign } from "@/hooks/useCampaigns";

export default function CampaignDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { campaign, loading } = useCampaign(id);
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [txStatus, setTxStatus] = useState<"idle" | "signing" | "submitting" | "success" | "error">("idle");
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);

  const handlePledge = async () => {
    if (!pledgeAmount || isNaN(Number(pledgeAmount))) return;
    setTxStatus("signing");

    try {
      const address = localStorage.getItem("connected_pubkey");
      if (!address) {
        alert("Please connect your wallet first via the top right button.");
        setTxStatus("idle");
        return;
      }

      const balance = await fetchBalance(address);
      // We add a ~2 XLM buffer for network reserves and transaction fees
      if (balance < Number(pledgeAmount) + 2) {
        alert("Pledge failed: Insufficient liquid XLM balance. You need at least " + (Number(pledgeAmount) + 2) + " XLM available (including network reserves).");
        setTxStatus("idle");
        return;
      }

      const { signTransactionWithKit } = await import("@/lib/wallet");

      const client = getCampaignClient(id);
      const amountInStroops = toStroops(pledgeAmount);
      
      const tx = await client.pledge({
        backer: address,
        amount: amountInStroops,
      }, { publicKey: address });

      setTxStatus("submitting");
      const sentTx = await tx.signAndSend({ signTransaction: signTransactionWithKit });
      console.log("Pledge successful!", sentTx);
      
      const txHash = (sentTx as any).sendTransactionResponse?.hash || (sentTx as any).getTransactionResponse?.hash;
      if (txHash) {
        setSuccessTxHash(txHash);
      } else {
        alert("Pledge successful!");
        window.location.reload();
      }
      setTxStatus("success");
    } catch (e: any) {
      const errorMessage = e?.message || String(e);
      
      if (errorMessage.includes("resulting balance is not within the allowed range") || errorMessage.includes("Error(Contract, #10)")) {
        alert("Pledge failed: You do not have enough available XLM in your wallet. Please note that some of your XLM might be locked in network reserves.");
      } else if (errorMessage.includes("User declined")) {
        alert("Transaction was rejected in the wallet.");
      } else {
        alert(`Error pledging: ${errorMessage}`);
      }
      setTxStatus("error");
    }
  };

  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const address = localStorage.getItem("connected_pubkey");
    if (address && campaign && address === campaign.creator) {
      setIsCreator(true);
    }
  }, [campaign]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this campaign? This action cannot be undone.")) return;
    setTxStatus("signing");
    try {
      const address = localStorage.getItem("connected_pubkey");
      if (!address) {
        alert("Please connect your wallet first.");
        setTxStatus("idle");
        return;
      }
      const { signTransactionWithKit } = await import("@/lib/wallet");
      const client = getCampaignClient(id);
      
      const tx = await client.cancel({ publicKey: address });

      setTxStatus("submitting");
      const sentTx = await tx.signAndSend({ signTransaction: signTransactionWithKit });
      
      const txHash = (sentTx as any).sendTransactionResponse?.hash || (sentTx as any).getTransactionResponse?.hash;
      if (txHash) {
        setSuccessTxHash(txHash);
      } else {
        alert("Campaign successfully cancelled!");
        window.location.reload();
      }
      setTxStatus("success");
    } catch (e: any) {
      const errorMessage = e?.message || String(e);
      if (errorMessage.includes("User declined")) {
        alert("Transaction was rejected in the wallet.");
      } else {
        alert(`Error cancelling: ${errorMessage}`);
      }
      setTxStatus("error");
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

  const progress = Math.min((Number(campaign.raised) / Number(campaign.goal)) * 100, 100);
  const isEnded = Math.floor(Date.now() / 1000) > campaign.deadlineSecs;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-4 md:py-8 px-4 md:px-6"
    >
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 md:mb-8 transition-colors font-medium text-sm">
        <ArrowLeft size={16} /> Back to Projects
      </Link>
      
      <div className="bg-white/90 rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden backdrop-blur-sm">
        <div className="w-full h-48 md:h-80 relative">
          <img 
            src={campaign.image} 
            alt={campaign.title} 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80";
            }}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="px-5 md:px-8 pb-8 md:pb-10 relative -mt-12 md:-mt-16">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">{campaign.title}</h1>
          {campaign.description && (
            <p className="text-gray-600 mb-4 max-w-2xl text-sm md:text-base">{campaign.description}</p>
          )}
          
          <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm mb-6 md:mb-8 bg-gray-50 inline-flex px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-gray-100">
            <User size={14} className="text-orange-400" />
            <span>By <span className="font-medium text-gray-700">{campaign.creator.slice(0, 8)}...{campaign.creator.slice(-8)}</span></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div className="space-y-4 md:space-y-6">
              <div className="bg-gray-50 p-5 md:p-6 rounded-[2rem] border border-gray-100">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{campaign.raised} <span className="text-base md:text-lg text-gray-500 font-medium">XLM</span></div>
                  <div className="text-orange-500 font-bold">{progress.toFixed(1)}%</div>
                </div>
                
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden my-3 md:my-4">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm font-medium">
                  <Target size={16} />
                  <span>Goal: {campaign.goal} XLM</span>
                </div>
              </div>

              <div className="bg-orange-50/50 p-4 md:p-6 rounded-3xl border border-orange-100/50 flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-orange-500">
                  <Clock size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</p>
                  <p className="text-sm md:text-base text-gray-900 font-medium">{campaign.deadline}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 md:p-8 rounded-[2rem] border border-gray-100 flex flex-col justify-center">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Support this project</h3>
              <p className="text-sm text-gray-500 mb-6">Enter an amount in XLM to pledge towards the campaign goal.</p>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Coins size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    aria-label="Pledge amount in XLM"
                    placeholder="Amount (XLM)"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm shadow-inner"
                    value={pledgeAmount}
                    onChange={(e) => setPledgeAmount(e.target.value)}
                  />
                </div>

                {campaign.isCancelled ? (
                  <button
                    disabled
                    className="w-full flex items-center justify-center py-3.5 rounded-xl font-bold bg-red-100 text-red-500 cursor-not-allowed text-sm"
                  >
                    Campaign Cancelled
                  </button>
                ) : (
                  <button
                    onClick={handlePledge}
                    disabled={txStatus === "signing" || txStatus === "submitting" || !pledgeAmount || isEnded}
                    className={`sticky-note-btn relative w-full flex items-center justify-center gap-2 py-3.5 rounded-md font-bold transition-all text-sm border-none group ${
                      isEnded 
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#fdf5c9] text-[#e88147] hover:bg-[#fbf1bb] hover:-rotate-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 w-10 h-3.5 bg-white/50 border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm rotate-[-3deg]" />
                    {txStatus === "signing" || txStatus === "submitting" ? (
                      <Loader2 size={18} className="animate-spin text-[#e88147]" />
                    ) : null}
                    {isEnded 
                      ? "Campaign Ended" 
                      : txStatus === "signing" 
                        ? "Please Sign in Wallet..." 
                        : txStatus === "submitting" 
                          ? "Submitting to Network..." 
                          : (
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-current animate-pulse shadow-[0_0_8px_currentColor]" />
                              Fund this project
                            </span>
                          )}
                  </button>
                )}

                {/* Creator Controls */}
                {isCreator && !campaign.isCancelled && !campaign.isClaimed && !isEnded && (
                  <button
                    onClick={handleCancel}
                    disabled={txStatus === "signing" || txStatus === "submitting"}
                    className="w-full flex items-center justify-center py-3 mt-4 rounded-xl font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-sm border border-red-100"
                  >
                    Cancel Campaign (Creator Only)
                  </button>
                )}

                {/* Refund Control */}
                {(campaign.isCancelled || (isEnded && Number(campaign.raised) < Number(campaign.goal))) && (
                  <button
                    onClick={async () => {
                      setTxStatus("signing");
                      try {
                        const address = localStorage.getItem("connected_pubkey");
                        if (!address) {
                          alert("Please connect your wallet first.");
                          setTxStatus("idle");
                          return;
                        }
                        const { signTransactionWithKit } = await import("@/lib/wallet");
                        const client = getCampaignClient(id);
                        
                        const tx = await client.refund({ backer: address }, { publicKey: address });
                        
                        setTxStatus("submitting");
                        const sentTx = await tx.signAndSend({ signTransaction: signTransactionWithKit });
                        
                        const txHash = (sentTx as any).sendTransactionResponse?.hash || (sentTx as any).getTransactionResponse?.hash;
                        if (txHash) {
                          setSuccessTxHash(txHash);
                        } else {
                          alert("Refund successful!");
                          window.location.reload();
                        }
                        setTxStatus("success");
                      } catch (e: any) {
                        const errorMessage = e?.message || String(e);
                        if (errorMessage.includes("no pledge found")) {
                          alert("You do not have an active pledge to refund.");
                        } else if (errorMessage.includes("User declined")) {
                          alert("Transaction was rejected in the wallet.");
                        } else {
                          alert(`Error refunding: ${errorMessage}`);
                        }
                        setTxStatus("error");
                      }
                    }}
                    disabled={txStatus === "signing" || txStatus === "submitting"}
                    className="w-full flex items-center justify-center py-3 mt-4 rounded-xl font-bold bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors text-sm border border-blue-100"
                  >
                    Claim Refund
                  </button>
                )}
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
          
          {/* Backers Section */}
          <div className="mt-12 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 tracking-tight">
                <User className="text-orange-400" size={20} /> 
                Contributors 
                <span className="text-sm font-medium text-orange-600 ml-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-100/50">
                  {campaign.backers.length} Total
                </span>
              </h3>
            </div>
            
            {campaign.backers.length === 0 ? (
              <p className="text-sm text-gray-500 italic bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
                No backers yet. Be the first to support this campaign!
              </p>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#f3f4f6 transparent' }}>
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-100">
                      <tr>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-16">Rank</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Contributor</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Share</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Pledged</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[...campaign.backers]
                        .sort((a, b) => Number(b.amount) - Number(a.amount))
                        .map((backer, index) => {
                          const percentage = Number(campaign.goal) > 0 
                            ? ((Number(backer.amount) / Number(campaign.goal)) * 100).toFixed(1) 
                            : "0.0";
                            
                          return (
                            <tr key={index} className="hover:bg-orange-50/30 transition-colors group">
                              <td className="py-4 px-6 text-sm font-bold text-gray-400 group-hover:text-orange-400 transition-colors">
                                {index + 1}
                              </td>
                              <td className="py-4 px-6">
                                <a 
                                  href={`https://stellar.expert/explorer/testnet/account/${backer.address}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-sm font-mono text-gray-700 group-hover:text-orange-500 transition-colors inline-flex items-center gap-2"
                                  title={backer.address}
                                >
                                  {backer.address.slice(0, 5)}...{backer.address.slice(-4)}
                                </a>
                              </td>
                              <td className="py-4 px-6 text-sm font-medium text-gray-500 text-right">
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">{percentage}%</span>
                              </td>
                              <td className="py-4 px-6 text-sm font-bold text-gray-900 text-right">
                                {backer.amount} <span className="text-xs text-gray-400 font-normal ml-1">XLM</span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
