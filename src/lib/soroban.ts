import { Client as FactoryClient } from "./stellar/factory/src";
import { Client as CampaignClient } from "./stellar/campaign/src";

const NETWORK_DETAILS = {
  networkPassphrase: "Test SDF Network ; September 2015",
  rpcUrl: "https://soroban-testnet.stellar.org",
};

const FACTORY_CONTRACT_ID = "CBGNLTWENII3LYUUVFU7DKCXV4HQTEKJQEUWXJKVIMVNMQL7E2DP2MEM";

export const getFactoryClient = () => {
  return new FactoryClient({
    ...NETWORK_DETAILS,
    contractId: FACTORY_CONTRACT_ID,
  });
};

export const getCampaignClient = (campaignId: string) => {
  return new CampaignClient({
    ...NETWORK_DETAILS,
    contractId: campaignId,
  });
};
