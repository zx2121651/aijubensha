import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, Send, Link as LinkIcon, Lock } from 'lucide-react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';

interface Clue {
  id: string;
  title: string;
  image: string;
  description: string;
  isPublic: boolean;
  type: string;
}

interface ClueDetailOverlayProps {
  clue: Clue | null;
  isOpen: boolean;
  onClose: () => void;
  players: any[];
}

export default function ClueDetailOverlay({ clue, isOpen, onClose, players }: ClueDetailOverlayProps) {
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const [scale, setScale] = useState(1);

  if (!clue) return null;

  const handleShareToPlayer = () => {
    showBottomSheet(
      <div className="p-6 bg-neutral-900 text-white rounded-t-3xl min-h-[40vh] flex flex-col">
        <h2 className="text-lg font-bold text-center mb-6">私下传阅线索</h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {players.filter(p => p.id !== 'me').map(p => (
            <div
              key={p.id}
              onClick={() => {
                alert(`已将线索偷偷传阅给 ${p.name}`);
                hideBottomSheet();
                onClose();
              }}
              className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <img src={p.avatar} className="w-12 h-12 rounded-full border-2 border-neutral-700" alt={p.name}/>
              <span className="text-[10px] text-neutral-400 truncate w-full text-center">{p.name}</span>
            </div>
          ))}
        </div>
        <button onClick={hideBottomSheet} className="w-full mt-auto py-4 bg-neutral-800 text-white font-bold rounded-full">取消</button>
      </div>
    );
  };

  const handleMakePublic = () => {
    if (clue.isPublic) {
      alert('该线索已经是公开状态了');
      return;
    }
    alert('线索已公开，所有人可见！');
    onClose();
  };

  const handleCombine = () => {
    alert('请选择另一条线索尝试组合');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 z-10 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg">{clue.title}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 bg-neutral-800 rounded text-neutral-400 border border-neutral-700">
                  {clue.type}
                </span>
                {clue.isPublic ? (
                  <span className="text-[10px] text-green-500 flex items-center gap-1"><Eye className="w-3 h-3"/>已公开</span>
                ) : (
                  <span className="text-[10px] text-red-500 flex items-center gap-1"><Lock className="w-3 h-3"/>仅自己可见</span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-neutral-800/80 rounded-full text-neutral-300 hover:text-white transition-colors active:scale-95">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Interactive Image Area */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden p-4">
             <motion.img
               drag
               dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
               whileTap={{ cursor: "grabbing" }}
               initial={{ scale: 0.8, y: 50 }}
               animate={{ scale: scale, y: 0 }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               src={clue.image}
               alt={clue.title}
               className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl cursor-grab"
               referrerPolicy="no-referrer"
               onDoubleClick={() => setScale(scale === 1 ? 1.5 : 1)}
             />
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 px-3 py-1 rounded-full text-[10px] text-neutral-300 backdrop-blur-sm pointer-events-none">
               双击缩放 / 拖拽查看
             </div>
          </div>

          {/* Description Panel */}
          <div className="bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-6 px-6 z-10 pointer-events-none">
            <p className="text-sm text-neutral-300 leading-relaxed text-justify mb-4 drop-shadow-md">
              {clue.description}
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-3 p-4 pb-safe bg-neutral-950 border-t border-neutral-900 z-10">
            <button
              onClick={handleMakePublic}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${clue.isPublic ? 'bg-neutral-800 text-neutral-500' : 'bg-red-600 text-white shadow-lg shadow-red-600/20'}`}
            >
              <Eye className="w-5 h-5" />
              公开线索
            </button>
            <button
              onClick={handleShareToPlayer}
              className="flex-1 py-3 bg-neutral-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-700 transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
              私下传阅
            </button>
            <button
              onClick={handleCombine}
              className="w-14 h-[48px] bg-neutral-800 text-neutral-400 rounded-xl flex items-center justify-center hover:text-white hover:bg-neutral-700 transition-all active:scale-95"
            >
              <LinkIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
