import * as Factory from "factory";
import * as Campaign from "campaign";

export const NETWORK_DETAILS = {
  network: "TESTNET",
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
};

// The factory address deployed earlier
export const FACTORY_ADDRESS = "CBGNLTWENII3LYUUVFU7DKCXV4HQTEKJQEUWXJKVIMVNMQL7E2DP2MEM";

export const getFactoryClient = () => {
  return new Factory.Client({
    ...NETWORK_DETAILS,
    contractId: FACTORY_ADDRESS,
  });
};

export const getCampaignClient = (campaignId: string) => {
  return new Campaign.Client({
    ...NETWORK_DETAILS,
    contractId: campaignId,
  });
};
