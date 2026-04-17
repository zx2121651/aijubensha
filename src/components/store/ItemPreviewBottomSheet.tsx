import React, { useState } from 'react';
import { X, UserPlus, Send, Settings2 } from 'lucide-react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';
import { motion, AnimatePresence } from 'motion/react';

interface PreviewItem {
  id: string;
  name: string;
  type: 'FRAME' | 'BUBBLE' | 'GIFT';
  imageUrl: string;
  desc: string;
  expiresAt?: string;
  isEquipped?: boolean;
}

export default function ItemPreviewBottomSheet({ item }: { item: PreviewItem }) {
  const { hideBottomSheet } = useBottomSheet();
  const [isEquipped, setIsEquipped] = useState(item.isEquipped || false);
  const localUser = JSON.parse(localStorage.getItem('user') || '{"avatar":"https://picsum.photos/seed/me/150/150", "nickname":"推理大师_Seven"}');

  const handleEquip = () => {
    setIsEquipped(!isEquipped);
    alert(isEquipped ? '已卸下装扮' : '穿戴成功！将在聊天和资料页展示');
    hideBottomSheet();
  };

  return (
    <div className="flex flex-col p-4 text-white relative pb-safe h-[60vh]">
      <button onClick={hideBottomSheet} className="absolute top-4 right-4 p-2 bg-neutral-800 rounded-full z-10 hover:bg-neutral-700 active:scale-95 transition-all">
        <X className="w-5 h-5" />
      </button>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-neutral-900 rounded-3xl mt-12 mb-6 border border-neutral-800">
         {/* Background blur decorative element */}
         <div className="absolute inset-0 opacity-20 pointer-events-none">
           <img src={item.imageUrl} className="w-full h-full object-cover blur-3xl scale-150" alt="blur bg" />
         </div>

         {item.type === 'FRAME' && (
           <div className="relative w-28 h-28 z-10">
             <img src={localUser.avatar || 'https://picsum.photos/seed/me/150/150'} alt="My Avatar" className="w-full h-full rounded-full object-cover border-4 border-neutral-800" />
             <img src={item.imageUrl} alt="Frame" className="absolute -inset-3 w-[calc(100%+24px)] max-w-none h-[calc(100%+24px)] pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-[spin_10s_linear_infinite]" />
           </div>
         )}

         {item.type === 'BUBBLE' && (
           <div className="relative z-10 max-w-[80%]">
             <div className="flex flex-row-reverse items-end gap-2">
               <img src={localUser.avatar || 'https://picsum.photos/seed/me/150/150'} alt="My Avatar" className="w-8 h-8 rounded-full object-cover border border-neutral-800" />
               <div
                 className="px-4 py-3 text-sm text-neutral-900 font-bold relative min-w-[120px] min-h-[44px] flex items-center justify-center"
                 style={{
                   borderImage: `url(${item.imageUrl}) 20 20 20 20 stretch stretch`,
                   borderImageWidth: '16px',
                   borderStyle: 'solid',
                   backgroundColor: 'transparent'
                 }}
               >
                 {/* Fallback if border-image is not perfectly handled in some basic browsers, we can also use a Stack */}
                 <div className="absolute inset-0 rounded-xl -z-10" style={{ backgroundImage: `url(${item.imageUrl})`, backgroundSize: '100% 100%' }} />
                 <span className="z-10 text-white drop-shadow-md">推理本真的太好玩啦！</span>
               </div>
             </div>
           </div>
         )}

         {item.type === 'GIFT' && (
           <motion.div
             initial={{ scale: 0.8, y: 20 }}
             animate={{ scale: 1, y: 0 }}
             transition={{ type: 'spring', damping: 10, stiffness: 100, repeat: Infinity, repeatType: 'reverse' }}
             className="relative w-32 h-32 z-10 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]"
           >
             <img src={item.imageUrl} alt="Gift" className="w-full h-full object-contain" />
           </motion.div>
         )}

         <div className="absolute bottom-4 left-0 right-0 text-center z-10">
           <div className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-700 text-xs font-bold">
             <Settings2 className="w-3 h-3 text-neutral-400" /> 实时穿戴预览
           </div>
         </div>
      </div>

      <div className="text-center mb-6 shrink-0">
        <h2 className="text-2xl font-black mb-1">{item.name}</h2>
        <p className="text-xs text-neutral-400 leading-relaxed mb-2 max-w-[80%] mx-auto">{item.desc}</p>
        {item.expiresAt && <div className="text-[10px] text-red-500 font-bold px-2 py-0.5 bg-red-500/10 rounded inline-block">有效期至：{item.expiresAt}</div>}
      </div>

      <div className="flex gap-3 shrink-0">
        {item.type === 'GIFT' ? (
          <button className="flex-1 py-4 bg-red-600 hover:bg-red-500 active:scale-[0.98] transition-all text-white font-black rounded-full flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(220,38,38,0.3)]" onClick={() => { alert('打开赠礼面板'); hideBottomSheet(); }}>
            <Send className="w-5 h-5" /> 赠送给好友
          </button>
        ) : (
          <>
            <button className="py-4 px-6 bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] transition-all text-white font-bold rounded-full flex items-center justify-center gap-2" onClick={() => { alert('已选择赠送目标'); hideBottomSheet(); }}>
              <Send className="w-5 h-5" /> 赠送
            </button>
            <button
              onClick={handleEquip}
              className={`flex-1 py-4 active:scale-[0.98] transition-all text-white font-black rounded-full flex items-center justify-center gap-2 ${isEquipped ? 'bg-neutral-800 border border-neutral-700 text-neutral-400' : 'bg-red-600 hover:bg-red-500 shadow-[0_4px_20px_rgba(220,38,38,0.3)]'}`}
            >
              {isEquipped ? '卸下装扮' : '立即佩戴'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
