import { Client as FactoryClient } from "./stellar/factory/src";
import { Client as CampaignClient } from "./stellar/campaign/src";

const getNetworkDetails = () => {
  const networkPassphrase = process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";
  let rpcUrl = process.env.NEXT_PUBLIC_STELLAR_RPC_URL || "https://soroban-testnet.stellar.org";
  const factoryContractId = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ID || "CCDZL5VN6SAD32TX6AHCKUWYMHJO43UN2LBUI34S4V5HAMIJCL46ICCA";

  // Sanitize the RPC URL in case the user forgot to add https:// in their Vercel config
  if (!rpcUrl.startsWith("http://") && !rpcUrl.startsWith("https://")) {
    rpcUrl = "https://" + rpcUrl;
  }

  return { networkPassphrase, rpcUrl, factoryContractId };
};

export const getFactoryClient = () => {
  const { networkPassphrase, rpcUrl, factoryContractId } = getNetworkDetails();
  return new FactoryClient({
    networkPassphrase,
    rpcUrl,
    allowHttp: true,
    contractId: factoryContractId,
  });
};

export const getCampaignClient = (campaignId: string) => {
  const { networkPassphrase, rpcUrl } = getNetworkDetails();
  return new CampaignClient({
    networkPassphrase,
    rpcUrl,
    allowHttp: true,
    contractId: campaignId,
  });
};
