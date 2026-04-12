import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDownRight, ArrowUpRight, Receipt, Filter } from 'lucide-react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';

const MOCK_HISTORY = [
  { id: 'T-98213', type: 'RECHARGE', amount: '+300', currency: '金币', title: 'App Store充值', date: '2024-05-12 14:20', status: '成功', method: 'Apple Pay', realAmount: '¥30.00' },
  { id: 'T-98214', type: 'CONSUME', amount: '-68', currency: '金币', title: '购买《死光法则》', date: '2024-05-12 15:30', status: '成功', method: '金币余额', realAmount: '' },
  { id: 'T-98215', type: 'GIFT', amount: '-10', currency: '金币', title: '赠送礼物 [玫瑰]', date: '2024-05-13 20:10', status: '成功', method: '金币余额', realAmount: '' },
  { id: 'T-98216', type: 'WITHDRAW', amount: '-100', currency: '余额', title: '微信提现', date: '2024-05-14 09:00', status: '处理中', method: '微信支付', realAmount: '¥100.00' },
];

export default function WalletHistory() {
  const navigate = useNavigate();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const [filter, setFilter] = useState<'ALL' | 'RECHARGE' | 'CONSUME'>('ALL');

  const filteredHistory = MOCK_HISTORY.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'RECHARGE') return item.type === 'RECHARGE';
    if (filter === 'CONSUME') return item.type === 'CONSUME' || item.type === 'GIFT';
    return true;
  });

  const showDetail = (item: any) => {
    showBottomSheet(
      <div className="p-6 bg-neutral-900 text-white rounded-t-3xl min-h-[50vh] flex flex-col">
        <div className="text-center mb-8">
          <div className="text-sm text-neutral-400 mb-2">{item.title}</div>
          <div className={`text-4xl font-black ${item.amount.startsWith('+') ? 'text-green-500' : 'text-white'}`}>
            {item.amount} <span className="text-lg">{item.currency}</span>
          </div>
        </div>

        <div className="space-y-4 text-sm bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">交易状态</span>
            <span className={item.status === '处理中' ? 'text-yellow-500 font-bold' : 'text-green-500 font-bold'}>{item.status}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">支付方式</span>
            <span className="text-neutral-300">{item.method}</span>
          </div>
          {item.realAmount && (
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">实付/实得金额</span>
              <span className="text-neutral-300 font-bold">{item.realAmount}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">交易时间</span>
            <span className="text-neutral-300">{item.date}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">订单号</span>
            <span className="text-neutral-300">{item.id}</span>
          </div>
        </div>

        <button
          onClick={hideBottomSheet}
          className="w-full mt-auto py-4 bg-neutral-800 text-white font-bold rounded-full hover:bg-neutral-700 active:scale-95 transition-all"
        >
          关闭
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="bg-neutral-950 px-4 py-3 sticky top-0 z-40 border-b border-neutral-900 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <span className="font-bold text-lg">账单明细</span>
          </div>
          <button className="p-2 -mr-2 text-neutral-400 hover:text-white transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 pb-1">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === 'ALL' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400'}`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('RECHARGE')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === 'RECHARGE' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400'}`}
          >
            收入
          </button>
          <button
            onClick={() => setFilter('CONSUME')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === 'CONSUME' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400'}`}
          >
            支出
          </button>
        </div>
      </header>

      <main className="p-4 flex flex-col gap-3 pb-safe">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            onClick={() => showDetail(item)}
            className="bg-neutral-900 p-4 rounded-2xl flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform border border-neutral-800 hover:border-neutral-700"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.amount.startsWith('+') ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {item.type === 'RECHARGE' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-white">{item.title}</span>
                <span className="text-[10px] text-neutral-500">{item.date}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-base font-black ${item.amount.startsWith('+') ? 'text-green-500' : 'text-white'}`}>
                {item.amount}
              </span>
              <span className="text-[10px] text-neutral-500">{item.status}</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
