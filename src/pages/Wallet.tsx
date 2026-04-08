import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Diamond, Coins, History, CreditCard, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Wallet() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'topup' | 'history'>('topup');

  const topupOptions = [
    { id: 1, diamonds: 60, price: 6, bonus: 0 },
    { id: 2, diamonds: 300, price: 30, bonus: 30 },
    { id: 3, diamonds: 680, price: 68, bonus: 80 },
    { id: 4, diamonds: 1280, price: 128, bonus: 180 },
    { id: 5, diamonds: 3280, price: 328, bonus: 500 },
    { id: 6, diamonds: 6480, price: 648, bonus: 1200 },
  ];

  const history = [
    { id: 1, title: '充值 680 钻石', time: '2026-04-07 14:30', amount: '+680', type: 'diamond', isPositive: true },
    { id: 2, title: '购买剧本《林家大院》', time: '2026-04-06 20:15', amount: '-120', type: 'diamond', isPositive: false },
    { id: 3, title: '对局结算奖励', time: '2026-04-05 23:40', amount: '+500', type: 'coin', isPositive: true },
    { id: 4, title: '购买头像框【樱花烂漫】', time: '2026-04-05 10:20', amount: '-2000', type: 'coin', isPositive: false },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-8">
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">我的钱包</h1>
        </div>
      </header>

      {/* Balance Cards */}
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
          <div className="relative z-10">
            <div className="text-white/70 text-sm font-medium mb-1 flex items-center gap-1.5">
              <Diamond className="w-4 h-4 text-blue-400" /> 钻石余额
            </div>
            <div className="text-3xl font-bold tracking-tight">1,280</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-neutral-500 text-sm font-medium mb-1 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-yellow-500" /> 金币余额
            </div>
            <div className="text-2xl font-bold text-neutral-900">15,400</div>
          </div>
          <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-bold rounded-full transition-colors">
            去赚金币
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex bg-neutral-100 p-1 rounded-xl">
          <button 
            className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2", activeTab === 'topup' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500')}
            onClick={() => setActiveTab('topup')}
          >
            <CreditCard className="w-4 h-4" /> 钻石充值
          </button>
          <button 
            className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2", activeTab === 'history' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500')}
            onClick={() => setActiveTab('history')}
          >
            <History className="w-4 h-4" /> 账单明细
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'topup' ? (
          <div className="grid grid-cols-2 gap-3">
            {topupOptions.map(option => (
              <div key={option.id} className="bg-white rounded-2xl p-4 border border-neutral-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group">
                {option.bonus > 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                    赠 {option.bonus}
                  </div>
                )}
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Diamond className="w-5 h-5 text-blue-500" />
                  <span className="text-xl font-bold text-neutral-900">{option.diamonds}</span>
                </div>
                <button className="w-full py-2 bg-blue-50 group-hover:bg-blue-500 text-blue-600 group-hover:text-white text-sm font-bold rounded-xl transition-colors">
                  ¥ {option.price}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
            {history.map((item, idx) => (
              <div key={item.id} className={cn("p-4 flex items-center justify-between", idx !== history.length - 1 && "border-b border-neutral-50")}>
                <div>
                  <div className="font-bold text-neutral-900 text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-neutral-400">{item.time}</div>
                </div>
                <div className={cn("font-bold flex items-center gap-1", item.isPositive ? (item.type === 'diamond' ? 'text-blue-500' : 'text-yellow-600') : 'text-neutral-900')}>
                  {item.amount}
                  {item.type === 'diamond' ? <Diamond className="w-3.5 h-3.5" /> : <Coins className="w-3.5 h-3.5" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
