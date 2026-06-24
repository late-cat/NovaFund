import { Rocket, Clock, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CampaignProps {
  id: string;
  title: string;
  creator: string;
  goal: number;
  raised: number;
  deadline: string;
  image?: string;
}

export default function CampaignCard({
  id,
  title,
  creator,
  goal,
  raised,
  deadline,
  image = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
}: CampaignProps) {
  const progress = Math.min((raised / goal) * 100, 100);

  return (
    <div className="group glass-panel rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col h-full border border-white/5 hover:border-purple-500/30">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] to-transparent z-10 opacity-60" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-xs font-semibold text-purple-300">
          Active
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-400 mb-6 font-medium">By {creator}</p>

        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span className="text-purple-400">{progress.toFixed(1)}% Raised</span>
            <span className="text-gray-300">
              {raised} / {goal} XLM
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-6 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-400 text-sm gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Clock size={14} className="text-blue-400" />
              <span>{deadline}</span>
            </div>

            <Link
              href={`/campaign/${id}`}
              className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition-colors duration-300 border border-purple-500/20"
            >
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
