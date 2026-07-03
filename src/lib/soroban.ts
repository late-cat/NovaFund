import { Client as FactoryClient } from "./stellar/factory/src";
import { Client as CampaignClient } from "./stellar/campaign/src";

const networkPassphrase = process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE;
const rpcUrl = process.env.NEXT_PUBLIC_STELLAR_RPC_URL;
const factoryContractId = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ID;

if (!networkPassphrase || !rpcUrl || !factoryContractId) {
  throw new Error("Missing required environment variables for Soroban configuration. Please check your .env file.");
}

const NETWORK_DETAILS = {
  networkPassphrase,
  rpcUrl,
};

export const getFactoryClient = () => {
  return new FactoryClient({
    ...NETWORK_DETAILS,
    contractId: factoryContractId,
  });
};

export const getCampaignClient = (campaignId: string) => {
  return new CampaignClient({
    ...NETWORK_DETAILS,
    contractId: campaignId,
  });
};
