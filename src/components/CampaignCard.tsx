import { Clock, Pin } from "lucide-react";
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
    <Link href={`/campaign/${id}`} className="block group h-full">
      <div className="sticky-note relative h-full w-full p-4 transition-all duration-300 hover:-translate-y-1 flex flex-col group-hover:-rotate-1">
        
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 w-12 h-3.5 bg-white/50 border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm rotate-[-3deg]" />
        
        <div className="relative w-full h-36 rounded-sm bg-gray-200 overflow-hidden mb-4 border border-gray-300 shadow-inner mt-4">
           <img 
             src={image} 
             alt={title}
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
           />
        </div>
        
        <div className="flex flex-col flex-grow justify-between relative z-20">
          <div>
            <h3 className="text-lg font-bold line-clamp-1 leading-tight group-hover:text-[#e88147] transition-colors font-serif mb-0.5">
              {title}
            </h3>
            <span className="text-[11px] text-gray-500 font-medium">By {creator}</span>
          </div>
          
          <div className="mt-4">
             <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3 shadow-inner">
               <div className="h-full bg-[#e88147]" style={{ width: `${progress}%` }} />
             </div>
             <div className="flex justify-between text-[11px] font-bold text-gray-700">
               <span>{raised} / {goal} XLM</span>
               <span>{progress.toFixed(0)}%</span>
             </div>
          </div>
          
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-dashed border-[#d4c6a0] text-xs font-medium text-gray-600">
             <Clock size={12} className="text-gray-400" />
             <span>{deadline}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
