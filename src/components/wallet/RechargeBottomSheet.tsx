import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';

const RECHARGE_OPTIONS = [
  { id: 1, amount: 6, coins: 60, bonus: 0 },
  { id: 2, amount: 30, coins: 300, bonus: 30 },
  { id: 3, amount: 68, coins: 680, bonus: 80 },
  { id: 4, amount: 128, coins: 1280, bonus: 180 },
  { id: 5, amount: 328, coins: 3280, bonus: 500 },
  { id: 6, amount: 648, coins: 6480, bonus: 1200 }
];

export default function RechargeBottomSheet() {
  const { hideBottomSheet } = useBottomSheet();
  const [selectedOption, setSelectedOption] = useState(RECHARGE_OPTIONS[1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate network request for payment
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        hideBottomSheet();
        // Typically you would refresh user context here
      }, 1500);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[40vh] text-white">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-[bounce_1s_ease-in-out]">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-black mb-2">充值成功</h2>
        <p className="text-neutral-400">已获得 {selectedOption.coins + selectedOption.bonus} 金币</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 text-white relative pb-8">
      <button onClick={hideBottomSheet} className="absolute top-4 right-4 p-2 bg-neutral-800 rounded-full z-10 hover:bg-neutral-700 active:scale-95 transition-all">
        <X className="w-5 h-5" />
      </button>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">余额不足，请充值</h2>
        <p className="text-xs text-neutral-400 mt-1">购买剧本或打赏需要消耗金币</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {RECHARGE_OPTIONS.map((opt) => (
          <div
            key={opt.id}
            onClick={() => setSelectedOption(opt)}
            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all active:scale-95 cursor-pointer ${
              selectedOption.id === opt.id
                ? 'border-yellow-500 bg-yellow-500/10'
                : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
            }`}
          >
            {opt.bonus > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                送{opt.bonus}
              </div>
            )}
            <div className="flex items-end gap-1 mb-1">
              <span className="text-lg font-black text-yellow-500">{opt.coins}</span>
              <span className="text-[10px] text-yellow-600 mb-1">币</span>
            </div>
            <div className="text-sm font-bold text-white">¥ {opt.amount}</div>
          </div>
        ))}
      </div>

      <button
        onClick={handlePay}
        disabled={isProcessing}
        className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 active:scale-[0.98] transition-all text-black font-black rounded-full text-lg shadow-[0_4px_20px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          `确认支付 ¥ ${selectedOption.amount}`
        )}
      </button>

      <p className="text-center text-[10px] text-neutral-500 mt-4">
        点击支付即代表同意 <a href="#" className="text-neutral-400 underline">《用户充值协议》</a>
      </p>
    </div>
  );
}
