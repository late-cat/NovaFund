import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID
} from "@creit.tech/stellar-wallets-kit";

let kitInstance: StellarWalletsKit | null = null;

export const getKit = () => {
  if (typeof window === "undefined") return null as any;
  if (!kitInstance) {
    kitInstance = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: allowAllModules(),
    });
  }
  return kitInstance;
};

export const signTransactionWithKit = async (xdr: string, opts?: any): Promise<{ signedTxXdr: string }> => {
  const kit = getKit();
  const result = await kit.signTransaction(xdr, {
    networkPassphrase: opts?.networkPassphrase || "Test SDF Network ; September 2015",
  });
  
  if (typeof result === "string") {
    return { signedTxXdr: result };
  } else if (result && (result as any).signedTxXdr) {
    return { signedTxXdr: (result as any).signedTxXdr };
  } else if (result && (result as any).signedXDR) {
    return { signedTxXdr: (result as any).signedXDR };
  } else if (result && (result as any).result) {
    return { signedTxXdr: (result as any).result };
  }
  
  throw new Error("Failed to sign transaction with wallet kit");
};
