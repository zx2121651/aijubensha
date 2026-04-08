import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Coins, Search, Gift, Sparkles, Crown, Image as ImageIcon, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const storeItems = {
  scripts: [
    { id: 's1', title: '《暗夜玫瑰》', type: '硬核推理', price: 1200, cover: 'https://picsum.photos/seed/s1/150/200' },
    { id: 's2', title: '《长安幻夜》', type: '古风阵营', price: 1500, cover: 'https://picsum.photos/seed/s2/150/200' },
    { id: 's3', title: '《星际迷航》', type: '科幻机制', price: 1800, cover: 'https://picsum.photos/seed/s3/150/200' },
  ],
  props: [
    { id: 'p1', name: '鲜花', desc: '送给表现出色的玩家', price: 10, icon: '🌸' },
    { id: 'p2', name: '臭鸡蛋', desc: '送给划水的玩家', price: 10, icon: '🥚' },
    { id: 'p3', name: '线索放大镜', desc: '单局游戏中额外获得一次搜证机会', price: 500, icon: '🔍' },
    { id: 'p4', name: '免死金牌', desc: '抵消一次被投凶的惩罚', price: 2000, icon: '🛡️' },
  ],
  cosmetics: [
    { id: 'c1', name: '黄金王冠头像框', type: '头像框', price: 5000, icon: '👑' },
    { id: 'c2', name: '赛博朋克气泡', type: '聊天气泡', price: 3000, icon: '💬' },
    { id: 'c3', name: '星光璀璨入场', type: '入场特效', price: 8000, icon: '✨' },
  ]
};

export default function Store() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'scripts' | 'props' | 'cosmetics'>('scripts');
  const [balance, setBalance] = useState(12500);

  const handlePurchase = (price: number, name: string) => {
    if (balance >= price) {
      if (window.confirm(`确认花费 ${price} 金币购买 ${name} 吗？`)) {
        setBalance(prev => prev - price);
        alert('购买成功！');
      }
    } else {
      alert('金币不足，请先充值！');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-neutral-900">商城</h1>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-bold text-yellow-600">{balance.toLocaleString()}</span>
            <button className="ml-1 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-yellow-600 transition-colors">
              +
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-neutral-100">
          <button 
            className={cn("pb-3 text-sm font-bold relative transition-colors flex items-center gap-1", activeTab === 'scripts' ? "text-red-600" : "text-neutral-500")}
            onClick={() => setActiveTab('scripts')}
          >
            <BookOpen className="w-4 h-4" />
            付费剧本
            {activeTab === 'scripts' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
          <button 
            className={cn("pb-3 text-sm font-bold relative transition-colors flex items-center gap-1", activeTab === 'props' ? "text-red-600" : "text-neutral-500")}
            onClick={() => setActiveTab('props')}
          >
            <Gift className="w-4 h-4" />
            游戏道具
            {activeTab === 'props' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
          <button 
            className={cn("pb-3 text-sm font-bold relative transition-colors flex items-center gap-1", activeTab === 'cosmetics' ? "text-red-600" : "text-neutral-500")}
            onClick={() => setActiveTab('cosmetics')}
          >
            <Sparkles className="w-4 h-4" />
            个性装扮
            {activeTab === 'cosmetics' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'scripts' && (
          <div className="grid grid-cols-2 gap-4">
            {storeItems.scripts.map(item => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col">
                <img src={item.cover} alt={item.title} className="w-full aspect-[3/4] object-cover" referrerPolicy="no-referrer" />
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">{item.title}</h3>
                  <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-sm self-start mb-3">{item.type}</span>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-bold text-yellow-600">{item.price}</span>
                    </div>
                    <button 
                      onClick={() => handlePurchase(item.price, item.title)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      购买
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'props' && (
          <div className="space-y-3">
            {storeItems.props.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center text-2xl border border-neutral-100">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900 text-sm">{item.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{item.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-500" />
                    <span className="text-sm font-bold text-yellow-600">{item.price}</span>
                  </div>
                  <button 
                    onClick={() => handlePurchase(item.price, item.name)}
                    className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    购买
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cosmetics' && (
          <div className="grid grid-cols-2 gap-4">
            {storeItems.cosmetics.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl flex items-center justify-center text-3xl border border-neutral-200 mb-3 shadow-inner">
                  {item.icon}
                </div>
                <h3 className="font-bold text-neutral-900 text-sm">{item.name}</h3>
                <span className="text-[10px] text-neutral-500 mt-1">{item.type}</span>
                <div className="w-full mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-500" />
                    <span className="text-sm font-bold text-yellow-600">{item.price}</span>
                  </div>
                  <button 
                    onClick={() => handlePurchase(item.price, item.name)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    购买
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
