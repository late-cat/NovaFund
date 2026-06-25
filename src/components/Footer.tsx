
import { Github, Twitter, Globe, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white/50 backdrop-blur-sm border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 font-outfit font-bold text-xl tracking-tight text-gray-800">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-500 w-6 h-6"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            NovaFund
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Decentralized crowdfunding on Stellar.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex gap-4 text-gray-400">
            <a href="https://github.com/late-cat/NovaFund" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              <Globe size={20} />
            </a>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1 font-medium">
            Built with <Heart size={12} className="text-red-400" /> for the Stellar Belt Challenge
          </p>
        </div>
      </div>
    </footer>
  );
}
