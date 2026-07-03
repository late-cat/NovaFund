import { Client as FactoryClient } from "./stellar/factory/src";
import { Client as CampaignClient } from "./stellar/campaign/src";

const getNetworkDetails = () => {
  const networkPassphrase = process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE;
  const rpcUrl = process.env.NEXT_PUBLIC_STELLAR_RPC_URL;
  const factoryContractId = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ID;

  if (!networkPassphrase || !rpcUrl || !factoryContractId) {
    console.warn("Missing required environment variables for Soroban configuration.");
    return { networkPassphrase: "", rpcUrl: "", factoryContractId: "" };
  }

  return { networkPassphrase, rpcUrl, factoryContractId };
};

export const getFactoryClient = () => {
  const { networkPassphrase, rpcUrl, factoryContractId } = getNetworkDetails();
  return new FactoryClient({
    networkPassphrase,
    rpcUrl,
    allowHttp: rpcUrl?.startsWith("http://"),
    contractId: factoryContractId,
  });
};

export const getCampaignClient = (campaignId: string) => {
  const { networkPassphrase, rpcUrl } = getNetworkDetails();
  return new CampaignClient({
    networkPassphrase,
    rpcUrl,
    allowHttp: rpcUrl?.startsWith("http://"),
    contractId: campaignId,
  });
};
