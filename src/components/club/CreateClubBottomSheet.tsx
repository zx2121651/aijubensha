import React, { useState } from 'react';
import { X, ImagePlus, AlertCircle } from 'lucide-react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';
import RechargeBottomSheet from '@/src/components/wallet/RechargeBottomSheet';

export default function CreateClubBottomSheet() {
  const { hideBottomSheet, showBottomSheet } = useBottomSheet();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const MOCK_BALANCE = 500; // 假设余额不足
  const COST = 1000;

  const handleCreate = () => {
    if (!name.trim()) {
      alert('请填写公会名称');
      return;
    }

    if (MOCK_BALANCE < COST) {
      // 余额不足，直接滑出充值抽屉
      showBottomSheet(<RechargeBottomSheet />);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('公会创建成功！');
      hideBottomSheet();
    }, 1500);
  };

  return (
    <div className="flex flex-col p-4 text-white relative pb-safe h-[80vh] overflow-y-auto scrollbar-hide">
      <button onClick={hideBottomSheet} className="absolute top-4 right-4 p-2 bg-neutral-800 rounded-full z-10 hover:bg-neutral-700 active:scale-95 transition-all">
        <X className="w-5 h-5" />
      </button>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">创建剧本杀公会</h2>
        <p className="text-xs text-neutral-400 mt-1">集结同好，打造专属推理社群</p>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {/* Logo Upload Placeholder */}
        <div className="self-center">
          <div className="w-24 h-24 rounded-2xl bg-neutral-900 border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:text-red-500 transition-colors active:scale-95 group">
            <ImagePlus className="w-8 h-8 text-neutral-500 group-hover:text-red-500 transition-colors mb-1" />
            <span className="text-[10px] text-neutral-500 group-hover:text-red-500 transition-colors">上传公会Logo</span>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800 focus-within:border-red-500/50 transition-colors">
          <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">公会名称 (最长12字符)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={12}
            placeholder="例如：杭州无情推土机联盟"
            className="w-full bg-transparent border-none outline-none text-sm text-white mt-1"
          />
        </div>

        <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800 focus-within:border-red-500/50 transition-colors flex-1">
          <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">公会招募宣言</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="写下你们的打本要求和口号，吸引同好加入..."
            className="w-full bg-transparent border-none outline-none text-sm text-white mt-1 h-24 resize-none"
          />
        </div>

        <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-4 flex items-start gap-3 mt-auto">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex flex-col">
             <span className="text-sm font-bold text-red-400 mb-1">创建条件与资产消耗</span>
             <span className="text-xs text-neutral-300 leading-relaxed text-justify">创建公会需要消耗 <strong className="text-yellow-500">1000 金币</strong>。您当前的余额为 <strong className="text-yellow-500">{MOCK_BALANCE}</strong> 金币。若余额不足，点击下方按钮将前往充值。</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleCreate}
        disabled={isProcessing}
        className="w-full mt-4 py-4 bg-red-600 hover:bg-red-500 active:scale-[0.98] transition-all text-white font-black rounded-full text-lg shadow-[0_4px_20px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          MOCK_BALANCE >= COST ? '确认消耗并创建' : '余额不足，去充值'
        )}
      </button>
    </div>
  );
}
