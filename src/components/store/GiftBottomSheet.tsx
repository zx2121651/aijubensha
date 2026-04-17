import React, { useState } from 'react';
import { X, Send, Coins } from 'lucide-react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';
import RechargeBottomSheet from '@/src/components/wallet/RechargeBottomSheet';
import { motion, AnimatePresence } from 'motion/react';

interface GiftTarget {
  id: string;
  name: string;
  avatar: string;
}

const GIFTS = [
  { id: 'g1', name: '一朵玫瑰', price: 10, icon: '🌹' },
  { id: 'g2', name: '比心', price: 50, icon: '🫶' },
  { id: 'g3', name: '小熊饼干', price: 99, icon: '🧸' },
  { id: 'g4', name: '大喇叭', price: 200, icon: '📣' },
  { id: 'g5', name: '跑车', price: 500, icon: '🏎️' },
  { id: 'g6', name: '豪华游艇', price: 1000, icon: '🛥️' },
  { id: 'g7', name: '私人飞机', price: 2000, icon: '✈️' },
  { id: 'g8', name: '漫天繁星', price: 5000, icon: '✨' },
];

export default function GiftBottomSheet({ target }: { target: GiftTarget }) {
  const { hideBottomSheet, showBottomSheet } = useBottomSheet();
  const [selectedGift, setSelectedGift] = useState(GIFTS[0]);
  const [quantity, setQuantity] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const MOCK_BALANCE = 300;

  const handleSend = () => {
    const totalCost = selectedGift.price * quantity;
    if (MOCK_BALANCE < totalCost) {
      showBottomSheet(<RechargeBottomSheet />);
      return;
    }

    setIsSending(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSending(false);
      setShowAnimation(true);

      // Close sheet and animation after 2.5s
      setTimeout(() => {
        setShowAnimation(false);
        hideBottomSheet();
      }, 2500);
    }, 800);
  };

  return (
    <>
      <div className="flex flex-col p-4 text-white relative pb-safe h-[65vh]">
        <button onClick={hideBottomSheet} className="absolute top-4 right-4 p-2 bg-neutral-800 rounded-full z-10 hover:bg-neutral-700 active:scale-95 transition-all">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">送礼物给</h2>
          <div className="flex items-center justify-center gap-2 mt-2 bg-neutral-900 w-max mx-auto px-4 py-1.5 rounded-full border border-neutral-800">
             <img src={target.avatar} className="w-5 h-5 rounded-full object-cover" alt="avatar"/>
             <span className="text-xs text-white font-bold">{target.name}</span>
          </div>
        </div>

        {/* Gift Grid */}
        <div className="flex-1 overflow-y-auto mb-4 scrollbar-hide">
          <div className="grid grid-cols-4 gap-3">
            {GIFTS.map(gift => {
              const isSelected = selectedGift.id === gift.id;
              return (
                <div
                  key={gift.id}
                  onClick={() => { setSelectedGift(gift); setQuantity(1); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer active:scale-95 ${
                    isSelected ? 'bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <span className="text-3xl mb-1">{gift.icon}</span>
                  <span className="text-[10px] text-white font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">{gift.name}</span>
                  <div className="flex items-center gap-0.5 mt-1">
                    <Coins className="w-3 h-3 text-yellow-500" />
                    <span className="text-[10px] text-yellow-500">{gift.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center gap-3 shrink-0 pt-2 border-t border-neutral-800">
           <div className="flex items-center justify-between bg-neutral-900 rounded-full px-2 py-1 border border-neutral-800">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white active:scale-95"
              >-</button>
              <span className="w-10 text-center text-sm font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white active:scale-95"
              >+</button>
           </div>

           <div className="flex flex-col mx-2 items-end flex-1">
              <span className="text-[10px] text-neutral-400">总计消耗</span>
              <div className="flex items-center gap-1 font-black text-yellow-500 text-lg">
                {selectedGift.price * quantity} <Coins className="w-3 h-3" />
              </div>
           </div>

           <button
             onClick={handleSend}
             disabled={isSending}
             className="px-6 py-3.5 bg-red-600 hover:bg-red-500 active:scale-[0.98] transition-all text-white font-black rounded-full flex items-center gap-2 shadow-[0_4px_15px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:shadow-none"
           >
             {isSending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : '赠送'}
           </button>
        </div>

        {/* Balance Tip */}
        <div className="text-[10px] text-center mt-3 text-neutral-500">
           当前余额: <span className="text-yellow-500">{MOCK_BALANCE}</span> 金币
        </div>
      </div>

      {/* Fullscreen Animation Portal Simulation */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ type: 'spring', damping: 15 }}
            className="fixed inset-0 z-[200] pointer-events-none flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
              className="absolute w-[200vw] h-[200vw] bg-[radial-gradient(circle,rgba(220,38,38,0.2)_0%,transparent_50%)]"
            />
            <span className="text-9xl drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] animate-bounce mb-4">{selectedGift.icon}</span>
            <div className="text-center bg-black/50 px-6 py-2 rounded-full border border-neutral-700 backdrop-blur-md">
              <span className="text-white text-lg font-bold">送给 <span className="text-red-400">{target.name}</span> x {quantity}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
