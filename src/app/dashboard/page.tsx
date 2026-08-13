"use client";

import { useEffect, useState } from "react";
import { getFactoryClient, getCampaignClient } from "@/lib/soroban";
import { fromStroops } from "@/lib/stellar/utils";
import { Loader2, LayoutDashboard, Target, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardCampaign {
  id: string;
  title: string;
  image: string;
  goal: string;
  raised: string;
  myPledge: string;
  isCreator: boolean;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    const address = localStorage.getItem("connected_pubkey");
    if (!address) {
      setLoading(false);
      return;
    }
    setUserAddress(address);

    const fetchDashboard = async () => {
      try {
        const factory = getFactoryClient();
        const { result } = await factory.get_campaigns({ start: 0, limit: 100 });
        
        if (result) {
          const promises = result.map(async (id: string) => {
            const client = getCampaignClient(id);
            try {
              const { result: stateResult } = await client.get_state();
              if (!stateResult) return null;

              // If the new getter exists on the contract, we use it. 
              // Otherwise we default to 0 for backwards compatibility with old factory deployments.
              let myPledge = "0";
              try {
                const { result: pledgeAmount } = await (client as any).get_pledge({ backer: address });
                if (pledgeAmount) {
                   myPledge = fromStroops(pledgeAmount);
                }
              } catch(e) {
                 // get_pledge might not exist on older campaigns deployed by an old factory
                 console.log("Could not fetch pledge for", id);
              }

              const isCreator = stateResult.creator === address;

              if (isCreator || Number(myPledge) > 0) {
                let metaTitle = stateResult.name || `Campaign ${id.slice(0, 6)}`;
                let metaImage = stateResult.image_url || "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80";

                return {
                  id,
                  title: metaTitle,
                  image: metaImage,
                  goal: fromStroops(stateResult.goal),
                  raised: fromStroops(stateResult.current_amount),
                  myPledge,
                  isCreator
                } as DashboardCampaign;
              }
            } catch (err) {
              console.error("Error fetching state for campaign", id, err);
            }
            return null;
          });

          const resolved = await Promise.all(promises);
          const valid = resolved.filter((c): c is DashboardCampaign => c !== null);
          setData(valid.reverse());
        }
      } catch (err) {
        console.error("Failed to fetch dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="animate-spin text-orange-400" size={40} />
      </div>
    );
  }

  if (!userAddress) {
    return (
      <div className="text-center py-32 max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400">
          <LayoutDashboard size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Connect your wallet</h2>
        <p className="text-gray-500 mb-6">Please connect your Freighter wallet to view your dashboard and track your pledges.</p>
      </div>
    );
  }

  const createdCampaigns = data.filter(c => c.isCreator);
  const backedCampaigns = data.filter(c => Number(c.myPledge) > 0);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage your created campaigns and track your pledges.</p>
      </div>

      <div className="space-y-12">
        {/* Created Campaigns */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Target className="text-orange-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">My Campaigns</h2>
          </div>
          {createdCampaigns.length === 0 ? (
             <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 text-center">
               <p className="text-gray-500 mb-4">You haven&apos;t created any campaigns yet.</p>
               <Link href="/create" className="text-orange-500 hover:underline font-medium">Start a Campaign</Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdCampaigns.map((campaign, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={`created-${campaign.id}`}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group flex flex-col"
                >
                  <Link href={`/campaign/${campaign.id}`} className="block relative h-40 overflow-hidden">
                    <img 
                      src={campaign.image} 
                      alt={campaign.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg truncate drop-shadow-md">{campaign.title}</h3>
                    </div>
                  </Link>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-500 font-medium">Raised</span>
                        <span className="font-bold text-gray-900">{campaign.raised} / {campaign.goal} XLM</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-400 rounded-full" 
                          style={{ width: `${Math.min((Number(campaign.raised) / Number(campaign.goal)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <Link href={`/campaign/${campaign.id}`} className="block w-full py-2.5 text-center text-sm font-bold text-orange-500 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors">
                      Manage Campaign
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Backed Campaigns */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-green-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">My Pledges</h2>
          </div>
          {backedCampaigns.length === 0 ? (
             <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 text-center">
               <p className="text-gray-500 mb-4">You haven&apos;t backed any campaigns yet.</p>
               <Link href="/" className="text-orange-500 hover:underline font-medium">Explore Projects</Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {backedCampaigns.map((campaign, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={`backed-${campaign.id}`}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group flex flex-col"
                >
                  <Link href={`/campaign/${campaign.id}`} className="block relative h-32 overflow-hidden">
                    <img 
                      src={campaign.image} 
                      alt={campaign.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-white font-bold text-base truncate drop-shadow-md">{campaign.title}</h3>
                    </div>
                  </Link>
                  <div className="p-5 flex-1 bg-gradient-to-b from-gray-50/50 to-white">
                    <div className="flex items-center justify-between mb-4 bg-green-50/80 px-4 py-3 rounded-2xl border border-green-100/50">
                      <span className="text-sm font-medium text-green-700">My Pledge</span>
                      <span className="text-lg font-bold text-green-700">{campaign.myPledge} XLM</span>
                    </div>
                    
                    <div className="flex justify-between text-xs mb-1.5 px-1">
                      <span className="text-gray-500 font-medium">Total Raised</span>
                      <span className="font-bold text-gray-700">{campaign.raised} / {campaign.goal} XLM</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-400 rounded-full" 
                        style={{ width: `${Math.min((Number(campaign.raised) / Number(campaign.goal)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
