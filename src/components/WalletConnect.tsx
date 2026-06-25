"use client";

import { useState, useEffect } from "react";
import { isAllowed, setAllowed, requestAccess, getAddress } from "@stellar/freighter-api";
import { Wallet, Loader2 } from "lucide-react";

export default function WalletConnect() {
  const [pubKey, setPubKey] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (await isAllowed()) {
      const { address } = await getAddress();
      if (address) {
        setPubKey(address);
      }
    }
  };

  const handleConnectClick = async () => {
    if (pubKey) {
      setPubKey("");
      return;
    }

    setIsConnecting(true);
    try {
      await setAllowed();
      const { address } = await requestAccess();
      if (address) setPubKey(address);
    } catch (e) {
      console.error(e);
    } finally {
      setIsConnecting(false);
    }
  };

  const formatKey = (key: string) => {
    if (!key) return "";
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <button
      onClick={handleConnectClick}
      disabled={isConnecting}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
        pubKey
          ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 group shadow-sm border border-gray-200"
          : "bg-[#e88147] hover:bg-[#d6723b] text-white shadow-md"
      }`}
    >
      {isConnecting ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Wallet size={16} />
      )}
      <span className="text-sm">
        {isConnecting ? "Connecting..." : pubKey ? (
          <span className="group-hover:hidden">{formatKey(pubKey)}</span>
        ) : "Connect"}
        {pubKey && <span className="hidden group-hover:inline">Disconnect</span>}
      </span>
    </button>
  );
}
