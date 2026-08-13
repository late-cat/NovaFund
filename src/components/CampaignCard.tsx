import { Clock } from "lucide-react";
import Link from "next/link";

interface CampaignProps {
  id: string;
  title: string;
  creator: string;
  goal: string;
  raised: string;
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
  const progress = Math.min((Number(raised) / Number(goal)) * 100, 100);

  return (
    <Link href={`/campaign/${id}`} className="block group h-full perspective-[1000px]">
      <div className="relative h-full w-full p-4 pt-6 transition-all duration-500 ease-out origin-top group-hover:-translate-y-2 group-hover:rotate-[-2deg] group-hover:scale-[1.02] bg-[#fdf5c9] text-[#4c4e67] shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.4)] group-hover:shadow-[0_20px_35px_-5px_rgba(0,0,0,0.1),0_10px_15px_-5px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.6)] rounded-[3px]">
        
        {/* Clean Minimalist Folded Corner */}
        <div 
          className="absolute top-0 right-0 w-0 h-0 z-20"
          style={{
            borderStyle: "solid",
            borderWidth: "0 28px 28px 0",
            borderColor: "transparent transparent #e0d5a3 transparent",
            filter: "drop-shadow(-1px 1px 2px rgba(0,0,0,0.1))"
          }}
        />
        {/* White triangle behind fold to reveal page */}
        <div 
          className="absolute top-0 right-0 w-0 h-0 z-10"
          style={{
            borderStyle: "solid",
            borderWidth: "0 28px 28px 0",
            borderColor: "transparent #fdfdfd transparent transparent"
          }}
        />
        
        {/* Tape */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 w-14 h-4 bg-white/40 border border-white/50 shadow-[0_1px_3px_rgba(0,0,0,0.08)] backdrop-blur-[2px] rotate-[-2deg] rounded-sm group-hover:shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
        
        <div className="relative w-full h-36 rounded-sm bg-gray-200 overflow-hidden mb-4 border border-gray-300 shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] mt-2">
           <img 
             src={image} 
             alt={title}
             onError={(e) => {
               (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80";
             }}
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
             <div className="w-full h-1.5 bg-[#e8ddb0] rounded-full overflow-hidden mt-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
               <div className="h-full bg-[#e88147] transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
             </div>
             <div className="flex justify-between text-[11px] font-bold text-gray-700 mt-1">
               <span>{raised} / {goal} XLM</span>
               <span>{progress.toFixed(0)}%</span>
             </div>
          </div>
          <div className="mt-4 pt-4 relative text-xs font-medium">
             <div className="flex items-center justify-between">
               <div className="flex flex-col gap-0.5">
                 <div className="flex items-center gap-1.5 text-gray-600">
                   <Clock size={12} className="text-gray-500" />
                   <span>{deadline}</span>
                 </div>
                 <span className="text-[10px] text-gray-400">Ends soon</span>
               </div>
               
               <div className="bg-white/80 text-[#e88147] border border-[#e88147]/20 shadow-sm px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase flex items-center group-hover:bg-[#e88147] group-hover:text-white transition-colors duration-300">
                  Fund this campaign
               </div>
             </div>
          </div>
        </div>

        {/* Bottom curl shadow for the whole card */}
        <div 
          className="absolute bottom-[2px] left-[15px] right-[15px] h-[20px] -z-10 transition-all duration-500 group-hover:bottom-[-6px] group-hover:shadow-[0_12px_20px_rgba(0,0,0,0.08)]"
          style={{
            borderRadius: "50%",
            boxShadow: "0 6px 12px rgba(0,0,0,0.06)"
          }}
        />
      </div>
    </Link>
  );
}
