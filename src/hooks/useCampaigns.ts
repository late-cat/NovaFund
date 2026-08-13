import { useState, useEffect } from "react";
import { getFactoryClient, getCampaignClient } from "@/lib/soroban";
import { fromStroops } from "@/lib/stellar/utils";

export interface BackerInfo {
  address: string;
  amount: string;
}

export interface CampaignData {
  id: string;
  title: string;
  description: string;
  creator: string;
  goal: string;
  raised: string;
  deadline: string;
  deadlineSecs: number;
  image: string;
  isClaimed: boolean;
  isCancelled: boolean;
  backers: BackerInfo[];
}

export function useCampaigns(limit = 100) {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const factory = getFactoryClient();
        const { result } = await factory.get_campaigns({ start: 0, limit });
        
        if (result) {
          const campaignPromises = result.map(async (id: string) => {
            const campaignClient = getCampaignClient(id);
            try {
              const { result: stateResult } = await campaignClient.get_state();
              if (stateResult) {
                // For explore page, we don't strictly need backers amounts, just public keys is fine
                // But we'll format it as BackerInfo with "0" to satisfy the interface
                const backers = (stateResult.backers || []).map((addr: string) => ({ address: addr, amount: "0" }));
                return formatCampaignData(id, stateResult, backers);
              }
            } catch (err) {
              console.error("Error fetching state for campaign", id, err);
            }
            return null;
          });

          const resolved = await Promise.all(campaignPromises);
          const validCampaigns = resolved.filter((c): c is CampaignData => c !== null);
          setCampaigns(validCampaigns.reverse());
        }
      } catch (err: any) {
        console.error("Failed to fetch campaigns", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [limit]);

  return { campaigns, loading, error };
}

export function useCampaign(id: string) {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    
    let isMounted = true;
    
    const fetchCampaign = async () => {
      try {
        const client = getCampaignClient(id);
        const { result: stateResult } = await client.get_state();
        if (stateResult && isMounted) {
          
          // Fetch exact pledge amounts for each backer asynchronously!
          const backerPromises = (stateResult.backers || []).map(async (address: string) => {
             try {
                 const { result: pledgeAmount } = await (client as any).get_pledge({ backer: address });
                 return { address, amount: pledgeAmount ? fromStroops(pledgeAmount) : "0" };
             } catch(e) {
                 return { address, amount: "0" };
             }
          });
          
          const enrichedBackers = await Promise.all(backerPromises);
          setCampaign(formatCampaignData(id, stateResult, enrichedBackers));
        }
      } catch (err: any) {
        console.error("Failed to fetch campaign details", err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchCampaign();
    
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(() => {
      fetchCampaign();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id]);

  return { campaign, loading, error };
}

function formatCampaignData(id: string, state: any, backers: BackerInfo[] = []): CampaignData {
  const goalNum = fromStroops(state.goal);
  const raisedNum = fromStroops(state.current_amount);
  
  // The campaign card only needs YYYY-MM-DD which can be extracted from Date object
  const deadlineDate = new Date(Number(state.deadline) * 1000);
  
  const mockImages = [
    "https://images.unsplash.com/photo-1639762681485-074b7f4f40e6?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80"
  ];
  const charCode = id.charCodeAt(0) || 0;
  const mockImage = mockImages[charCode % mockImages.length];
  
  let metaTitle = state.name || `Campaign ${id.slice(0, 6)}`;
  let metaImage = state.image_url || mockImage;
  let metaDesc = state.description || "";

  return {
    id,
    title: metaTitle,
    description: metaDesc,
    creator: `${state.creator.slice(0, 4)}...${state.creator.slice(-4)}`,
    goal: goalNum,
    raised: raisedNum,
    deadline: deadlineDate.toISOString().split("T")[0],
    deadlineSecs: Number(state.deadline),
    image: metaImage,
    isClaimed: state.is_claimed,
    isCancelled: state.is_cancelled,
    backers: backers,
  };
}
