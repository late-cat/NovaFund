import { useState, useEffect } from "react";
import { getFactoryClient, getCampaignClient } from "@/lib/soroban";
import { fromStroops } from "@/lib/stellar/utils";

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
                return formatCampaignData(id, stateResult);
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
    const fetchCampaign = async () => {
      try {
        const client = getCampaignClient(id);
        const { result: stateResult } = await client.get_state();
        if (stateResult) {
          setCampaign(formatCampaignData(id, stateResult));
        }
      } catch (err: any) {
        console.error("Failed to fetch campaign details", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  return { campaign, loading, error };
}

function formatCampaignData(id: string, state: any): CampaignData {
  const goalNum = fromStroops(state.goal);
  const raisedNum = fromStroops(state.current_amount);
  
  // Keep original UI formatting for dates in campaign page, but use date-only format for cards
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
  
  let metaTitle = `Campaign ${id.slice(0, 6)}`;
  let metaImage = mockImage;
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

  return {
    id,
    title: metaTitle,
    description: metaDesc,
    creator: state.creator,
    goal: goalNum,
    raised: raisedNum,
    deadline: deadlineDate.toISOString().split("T")[0],
    deadlineSecs: Number(state.deadline),
    image: metaImage,
  };
}
