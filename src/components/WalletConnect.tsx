"use client";

import { useState, useEffect } from "react";
import { isAllowed, setAllowed, getUserInfo } from "@stellar/freighter-api";
import { Wallet } from "lucide-react";

export default function WalletConnect() {
  const [pubKey, setPubKey] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (await isAllowed()) {
      const userInfo = await getUserInfo();
      if (userInfo.publicKey) {
        setPubKey(userInfo.publicKey);
      }
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    try {
      await setAllowed();
      const userInfo = await getUserInfo();
      if (userInfo.publicKey) setPubKey(userInfo.publicKey);
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
      onClick={connect}
      disabled={isConnecting || !!pubKey}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
        pubKey
          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg hover:shadow-purple-500/25"
      }`}
    >
      <Wallet size={18} />
      {isConnecting ? "Connecting..." : pubKey ? formatKey(pubKey) : "Connect Wallet"}
    </button>
  );
}
