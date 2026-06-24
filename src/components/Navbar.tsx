import WalletConnect from "./WalletConnect";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b-0 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-purple-600 to-blue-500 p-2.5 rounded-xl group-hover:scale-105 transition-transform">
              <Rocket size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 tracking-tight">
              NovaFund
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/create"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Start Campaign
            </Link>
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}
