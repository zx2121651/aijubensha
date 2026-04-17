import React, { useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { Search, Loader2, Plus, Minus, MapPin, ZoomIn, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchTarget {
  id: string;
  name: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  isSearched: boolean;
  cost: number;
}

interface InvestigationMapProps {
  ap: number;
  onSearch: (target: SearchTarget) => Promise<boolean>; // return true if clue found
}

export default function InvestigationMap({ ap, onSearch }: InvestigationMapProps) {
  const mapUrl = 'https://picsum.photos/seed/map1/1000/800'; // 模拟的现场底图

  const [targets, setTargets] = useState<SearchTarget[]>([
    { id: 't1', name: '凌乱的床铺', x: 25, y: 30, isSearched: false, cost: 1 },
    { id: 't2', name: '碎裂的落地窗', x: 75, y: 40, isSearched: false, cost: 2 },
    { id: 't3', name: '血迹斑斑的地毯', x: 50, y: 70, isSearched: false, cost: 1 },
    { id: 't4', name: '倒落的台灯', x: 15, y: 80, isSearched: true, cost: 1 }, // 已搜查
  ]);

  const [scale, setScale] = useState(1);
  const [searchingId, setSearchingId] = useState<string | null>(null);
  const [flyingClue, setFlyingClue] = useState<{ id: string, x: number, y: number, img: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));

  const handleTargetClick = async (target: SearchTarget) => {
    if (target.isSearched) {
      alert(`【${target.name}】已经被搜查过了，没有什么新发现。`);
      return;
    }
    if (ap < target.cost) {
      alert(`行动力不足！搜查【${target.name}】需要 ${target.cost} AP，你当前只有 ${ap} AP。`);
      return;
    }

    if (!confirm(`确定消耗 ${target.cost} AP 搜查【${target.name}】吗？`)) return;

    setSearchingId(target.id);

    // Simulate API / Game Logic delay
    const success = await onSearch(target);

    setSearchingId(null);
    setTargets(prev => prev.map(t => t.id === target.id ? { ...t, isSearched: true } : t));

    if (success) {
       // Fire flying animation
       setFlyingClue({ id: target.id, x: target.x, y: target.y, img: 'https://picsum.photos/seed/clue/100/150' });
       setTimeout(() => setFlyingClue(null), 1500); // clear after animation
    } else {
       alert(`在【${target.name}】翻找了一番，并没有发现有价值的线索。`);
    }
  };

  return (
    <div className="relative w-full h-full bg-neutral-900 overflow-hidden flex flex-col items-center justify-center">
      {/* Top Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-800 flex items-center gap-2 pointer-events-auto shadow-lg">
           <ZapIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
           <span className="text-white font-black">{ap} <span className="text-xs text-neutral-400 font-normal">AP</span></span>
        </div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800 flex items-center gap-1 pointer-events-auto">
           <Info className="w-4 h-4 text-neutral-400" />
           <span className="text-[10px] text-neutral-300">拖拽平移 / 双指缩放</span>
        </div>
      </div>

            {/* Flying Clue Animation Overlay */}
      <AnimatePresence>
        {flyingClue && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.5,
              x: '-50%',
              y: '-50%',
              left: `${flyingClue.x}%`,
              top: `${flyingClue.y}%`
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1, 0.2],
              left: ['50%', '50%', '50%', '50%'], // center to bottom
              top: ['50%', '50%', '40%', '150%'], // arc up then down
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.3, 0.7, 1],
              ease: "easeInOut"
            }}
            className="absolute z-50 pointer-events-none"
            style={{ position: 'fixed' }} // attach to viewport
          >
            <div className="bg-white p-2 rounded-xl shadow-2xl rotate-12">
              <img src={flyingClue.img} className="w-24 h-32 object-cover rounded-lg" alt="clue" />
              <div className="text-center mt-2 text-xs font-bold text-black">+1 线索入包</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative"
      >
        <motion.div
          drag
          dragConstraints={containerRef}
          initial={{ scale: 1 }}
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full h-full origin-center flex items-center justify-center"
        >
          <div className="relative w-[800px] h-[600px] max-w-[200vw] max-h-[150vh]">
            <img
              src={mapUrl}
              alt="Crime Scene"
              className="w-full h-full object-cover rounded-3xl border-4 border-neutral-800 shadow-2xl opacity-60"
              draggable="false"
            />

            {/* Render Targets */}
            {targets.map(target => {
               const isSearching = searchingId === target.id;
               return (
                 <div
                   key={target.id}
                   className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                   style={{ left: `${target.x}%`, top: `${target.y}%` }}
                 >
                   {/* Tooltip */}
                   {!target.isSearched && !isSearching && (
                     <div className="mb-2 bg-black/80 px-2 py-1 rounded text-[10px] text-white border border-neutral-800 whitespace-nowrap opacity-0 md:opacity-100 hover:opacity-100 transition-opacity flex items-center gap-1">
                       {target.name} <span className="text-yellow-400">({target.cost} AP)</span>
                     </div>
                   )}

                   {/* Icon */}
                   <button
                     onClick={() => handleTargetClick(target)}
                     disabled={isSearching}
                     className={cn(
                       "relative w-10 h-10 rounded-full flex items-center justify-center transition-all",
                       target.isSearched
                         ? "bg-neutral-800 border-2 border-neutral-700 text-neutral-600 opacity-50"
                         : "bg-red-600/80 border-2 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.6)] hover:scale-110 active:scale-95"
                     )}
                   >
                     {isSearching ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                     ) : target.isSearched ? (
                       <MapPin className="w-5 h-5" />
                     ) : (
                       <>
                         <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75" />
                         <Search className="w-5 h-5 z-10" />
                       </>
                     )}
                   </button>
                 </div>
               );
            })}
          </div>
        </motion.div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-20">
        <button onClick={handleZoomIn} className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full border border-neutral-800 flex items-center justify-center text-white hover:bg-neutral-800 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full border border-neutral-800 flex items-center justify-center text-white hover:bg-neutral-800 transition-colors">
          <Minus className="w-5 h-5" />
        </button>
        <button onClick={() => setScale(1)} className="w-10 h-10 mt-2 bg-black/60 backdrop-blur-md rounded-full border border-neutral-800 flex items-center justify-center text-white hover:bg-neutral-800 transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ZapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
