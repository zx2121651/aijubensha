import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle2, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBottomSheet } from '@/src/context/BottomSheetContext';
import ItemPreviewBottomSheet from '@/src/components/store/ItemPreviewBottomSheet';

export default function Inventory() {
  const navigate = useNavigate();
  const { showBottomSheet } = useBottomSheet();
  const [activeTab, setActiveTab] = useState<'frames' | 'bubbles'>('frames');
  const [equippedFrame, setEquippedFrame] = useState('f1');
  const [equippedBubble, setEquippedBubble] = useState('b1');

  const frames = [
    { id: 'f1', name: '默认头像', image: 'https://picsum.photos/seed/f1/100/100', rarity: 'common' },
    { id: 'f2', name: '樱花烂漫', image: 'https://picsum.photos/seed/f2/100/100', rarity: 'rare' },
    { id: 'f3', name: '赛博朋克', image: 'https://picsum.photos/seed/f3/100/100', rarity: 'epic' },
    { id: 'f4', name: '至尊王者', image: 'https://picsum.photos/seed/f4/100/100', rarity: 'legendary' },
  ];

  const bubbles = [
    { id: 'b1', name: '默认气泡', color: 'bg-white border-neutral-200', text: 'text-neutral-900' },
    { id: 'b2', name: '暗夜幽灵', color: 'bg-neutral-900 border-neutral-700', text: 'text-white' },
    { id: 'b3', name: '粉红回忆', color: 'bg-pink-50 border-pink-200', text: 'text-pink-600' },
    { id: 'b4', name: '土豪金', color: 'bg-gradient-to-r from-yellow-100 to-yellow-300 border-yellow-400', text: 'text-yellow-900' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-8">
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">我的背包</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white px-4 pt-2 pb-4 shadow-sm mb-4">
        <div className="flex gap-6 border-b border-neutral-100">
          <button 
            className={cn("pb-3 text-sm font-bold relative transition-colors flex items-center gap-1.5", activeTab === 'frames' ? "text-red-600" : "text-neutral-500")}
            onClick={() => setActiveTab('frames')}
          >
            <ImageIcon className="w-4 h-4" /> 头像框
            {activeTab === 'frames' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
          <button 
            className={cn("pb-3 text-sm font-bold relative transition-colors flex items-center gap-1.5", activeTab === 'bubbles' ? "text-red-600" : "text-neutral-500")}
            onClick={() => setActiveTab('bubbles')}
          >
            <MessageSquare className="w-4 h-4" /> 聊天气泡
            {activeTab === 'bubbles' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'frames' ? (
          <div className="grid grid-cols-2 gap-4">
            {frames.map(frame => {
              const isEquipped = equippedFrame === frame.id;
              return (
                <div key={frame.id} className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex flex-col items-center relative">
                  {isEquipped && (
                    <div className="absolute top-2 right-2 text-green-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  <div className={cn(
                    "w-20 h-20 rounded-full p-1 mb-3",
                    frame.rarity === 'legendary' ? "bg-gradient-to-tr from-yellow-400 to-yellow-600" :
                    frame.rarity === 'epic' ? "bg-gradient-to-tr from-purple-400 to-purple-600" :
                    frame.rarity === 'rare' ? "bg-gradient-to-tr from-blue-400 to-blue-600" :
                    "bg-neutral-200"
                  )}>
                    <img src={frame.image} alt={frame.name} className="w-full h-full rounded-full object-cover border-2 border-white" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-3">{frame.name}</h3>
                  <button 
                    onClick={() => setEquippedFrame(frame.id)}
                    className={cn(
                      "w-full py-1.5 rounded-full text-xs font-bold transition-colors",
                      isEquipped ? "bg-neutral-100 text-neutral-400 cursor-default" : "bg-red-50 text-red-600 hover:bg-red-100"
                    )}
                  >
                    {isEquipped ? '已装备' : '装备'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {bubbles.map(bubble => {
              const isEquipped = equippedBubble === bubble.id;
              return (
                <div key={bubble.id} className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-900 text-sm mb-2">{bubble.name}</h3>
                    <div className={cn("px-4 py-2 rounded-2xl rounded-tl-sm w-fit border text-sm", bubble.color, bubble.text)}>
                      这是一条测试消息
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                    {isEquipped && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    <button 
                      onClick={() => setEquippedBubble(bubble.id)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-bold transition-colors",
                        isEquipped ? "bg-neutral-100 text-neutral-400 cursor-default" : "bg-red-50 text-red-600 hover:bg-red-100"
                      )}
                    >
                      {isEquipped ? '已装备' : '装备'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
