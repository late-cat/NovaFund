import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

interface CampaignListRowProps {
  id: string;
  title: string;
  description: string;
  goal: string;
  raised: string;
  creator: string;
  deadline: string;
  image?: string;
}

export default function CampaignListRow({
  id,
  title,
  description,
  goal,
  raised,
  creator,
  deadline,
  image = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
}: CampaignListRowProps) {
  const progress = Math.min((Number(raised) / Number(goal)) * 100, 100);

  return (
    <Link href={`/campaign/${id}`} className="block group mb-3">
      <div className="relative w-full p-3 md:p-4 transition-all duration-300 ease-out bg-white/60 backdrop-blur-md border border-gray-200/60 hover:border-orange-200 hover:bg-white/80 rounded-[4px] shadow-sm hover:shadow-[0_8px_20px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] overflow-hidden flex items-center gap-4">
        
        {/* Subtle Paper Texture Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.15] mix-blend-multiply pointer-events-none" 
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} 
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-row items-center gap-3 md:gap-4 w-full">
          
          {/* Thumbnail */}
          <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-[3px] bg-gray-200 border border-black/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] overflow-hidden">
             <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>

          {/* Title, Creator, Progress (stacked on mobile, row on desktop) */}
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4 min-w-0">
             
             {/* Title and Creator */}
             <div className="flex flex-col min-w-0 md:w-5/12">
               <h3 className="text-[13px] md:text-[15px] font-bold line-clamp-1 leading-tight group-hover:text-[#e88147] transition-colors font-serif truncate mb-0.5">
                 {title}
               </h3>
               <span className="text-[10px] md:text-[11px] text-gray-500 font-medium truncate">By {creator}</span>
             </div>

             {/* Progress Bar & Stats */}
             <div className="w-full md:w-7/12 flex flex-col justify-center">
                <div className="flex justify-between text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 md:mb-1.5 uppercase tracking-wider">
                  <span>{raised} <span className="hidden sm:inline">/ {goal}</span> XLM</span>
                  <span className="text-[#ff4e00]">{progress.toFixed(0)}%</span>
                </div>
                
                {/* Magical Mini Progress Bar */}
                <div className="w-full h-1 md:h-1.5 bg-[#e8ddb0]/60 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] relative overflow-hidden">
                  <style>{`
                    @keyframes fireFlowList {
                      0% { background-position: 200% 0; }
                      100% { background-position: 0% 0; }
                    }
                  `}</style>
                  <div 
                    className="absolute top-0 left-0 bottom-0 transition-all duration-1000 ease-out rounded-r-full shadow-[0_0_8px_rgba(255,78,0,0.6)]" 
                    style={{ 
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #ff4e00, #ff8c00, #ffcc00, #ff8c00, #ff4e00)",
                      backgroundSize: "200% 100%",
                      animation: "fireFlowList 2s linear infinite"
                    }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-white/60 blur-[1px] mix-blend-overlay" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full blur-[0.5px] shadow-[0_0_6px_2px_rgba(255,255,255,0.9)] translate-x-1/2" />
                  </div>
                </div>
             </div>
          </div>

          {/* Deadline (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 justify-center w-28 shrink-0">
             <Clock size={12} className="text-gray-400" />
             <span className="font-medium">{deadline}</span>
          </div>

          {/* CTA Button (Icon only on mobile, full on desktop) */}
          <div className="shrink-0 flex justify-end">
             <div className="bg-white text-gray-500 border border-gray-200 shadow-sm p-1.5 md:px-4 md:py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 group-hover:border-orange-200 group-hover:text-orange-500 group-hover:bg-orange-50 transition-all duration-300">
                <span className="hidden md:block">View</span> 
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
             </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
