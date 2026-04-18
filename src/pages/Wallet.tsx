import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBottomSheet } from '@/src/context/BottomSheetContext';
import RechargeBottomSheet from '@/src/components/wallet/RechargeBottomSheet';
import { ArrowLeft, Diamond, Coins, History, CreditCard, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWalletBalance, getWalletHistory, rechargeWallet } from '@/src/api/user';
import { motion, AnimatePresence } from 'motion/react';

export default function Wallet() {
  const { showBottomSheet } = useBottomSheet();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'topup' | 'history'>('topup');

  // Backend States
  const [balance, setBalance] = useState<number>(0);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const topupOptions = [
    { id: 1, diamonds: 60, price: 6, bonus: 0 },
    { id: 2, diamonds: 300, price: 30, bonus: 30 },
    { id: 3, diamonds: 680, price: 68, bonus: 80 },
    { id: 4, diamonds: 1280, price: 128, bonus: 180 },
    { id: 5, diamonds: 3280, price: 328, bonus: 500 },
    { id: 6, diamonds: 6480, price: 648, bonus: 1200 },
  ];

  const localUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = async () => {
    if (!localUser.id) return navigate('/auth');
    try {
      setIsLoading(true);
      const [balRes, histRes] = await Promise.all([
        getWalletBalance(localUser.id),
        getWalletHistory().catch(() => ({ data: [] })) // Optional mock fallback
      ]);
      setBalance(balRes.data.balance || 0);
      setHistoryLogs(histRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTopupClick = (opt: any) => {
    setSelectedOption(opt);
    showBottomSheet(<RechargeBottomSheet />);
    setIsSuccess(false);
  };

  const executeRecharge = async () => {
    if (!selectedOption) return;
    setIsProcessing(true);

    try {
      // 模拟真实支付网关的延迟体验 (防抖与仪式感)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const targetDiamonds = selectedOption.diamonds + selectedOption.bonus;
      // 调用真实 API 执行数据库修改
      await rechargeWallet({ userId: localUser.id, amount: targetDiamonds });

      setIsProcessing(false);
      setIsSuccess(true);

      // 支付成功后重新拉取余额和流水
      await fetchData();

      setTimeout(() => {
        setIsTopupModalOpen(false);
      }, 1500);

    } catch (error: any) {
      setIsProcessing(false);
      alert(error.response?.data?.message || '充值失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-8 font-sans">
      {/* Header */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-4 py-4 sticky top-0 z-40 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">我的钱包</h1>
        </div>
      </header>

      {/* Balance Cards */}
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-red-900 to-neutral-900 border border-red-900/30 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/20 rounded-full blur-2xl" />
          <h2 className="text-neutral-400 text-sm font-medium flex items-center gap-1.5 mb-2 relative z-10">
            <Diamond className="w-4 h-4 text-red-400" />
            钻石余额
          </h2>
          <div className="text-4xl font-black mb-4 relative z-10 flex items-end gap-1">
            {isLoading ? <span className="animate-pulse">---</span> : balance}
            <span className="text-sm font-medium text-red-200 mb-1">钻</span>
          </div>
          <p className="text-xs text-red-200/60 relative z-10">用于购买剧本、解锁高级匹配、打赏 DM</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 border-b border-neutral-800 mb-4 sticky top-[68px] bg-neutral-950 z-30">
        <button
          onClick={() => setActiveTab('topup')}
          className={cn(
            "flex-1 py-4 font-medium text-sm text-center relative transition-colors",
            activeTab === 'topup' ? "text-white" : "text-neutral-500 hover:text-neutral-300"
          )}
        >
          钻石充值
          {activeTab === 'topup' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex-1 py-4 font-medium text-sm text-center relative transition-colors",
            activeTab === 'history' ? "text-white" : "text-neutral-500 hover:text-neutral-300"
          )}
        >
          交易记录
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full" />}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'topup' ? (
        <div className="p-4 grid grid-cols-2 gap-4">
          {topupOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleTopupClick(opt)}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-red-500/50 hover:bg-neutral-800 transition-all active:scale-95 group relative overflow-hidden"
            >
              {opt.bonus > 0 && (
                <div className="absolute top-0 right-0 bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                  送 {opt.bonus}
                </div>
              )}
              <Diamond className="w-8 h-8 text-red-500 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xl font-bold">{opt.diamonds}</div>
              <div className="w-full mt-2 py-1.5 bg-neutral-800 group-hover:bg-red-900/30 text-sm font-medium rounded-lg transition-colors text-neutral-300 group-hover:text-red-400">
                ¥{opt.price}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {historyLogs.length === 0 ? (
            <div className="text-center py-20 text-neutral-500">
              <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>暂无交易流水</p>
            </div>
          ) : (
            historyLogs.map((log) => (
              <div key={log.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center justify-between hover:bg-neutral-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    log.type === 'RECHARGE' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  )}>
                    {log.type === 'RECHARGE' ? <Diamond className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-neutral-200">{log.description || log.type}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className={cn(
                  "font-bold font-mono",
                  log.type === 'RECHARGE' ? "text-green-400" : "text-white"
                )}>
                  {log.type === 'RECHARGE' ? '+' : '-'}{log.amount}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= 沉浸式模拟充值收银台 ================= */}
      <AnimatePresence>
        {isTopupModalOpen && selectedOption && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isProcessing && !isSuccess && setIsTopupModalOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-neutral-900 border-t border-neutral-800 rounded-t-3xl p-6 shadow-2xl z-10 flex flex-col items-center text-center"
            >
              {/* 标题 */}
              <div className="w-full flex justify-between items-center mb-6">
                <span className="w-8" />
                <h3 className="font-bold">收银台</h3>
                <button
                  onClick={() => setIsTopupModalOpen(false)}
                  disabled={isProcessing || isSuccess}
                  className="p-2 hover:bg-neutral-800 rounded-full disabled:opacity-0"
                >
                  <X className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              {/* 订单明细 */}
              <p className="text-sm text-neutral-400 mb-2">需支付金额</p>
              <div className="text-5xl font-black mb-8">
                <span className="text-3xl">¥</span>{selectedOption.price}
              </div>

              <div className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 mb-8 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">充值账号</span>
                  <span className="font-medium text-neutral-200">{localUser.nickname || localUser.id.substring(0,8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">获得钻石</span>
                  <span className="font-medium text-red-400 flex items-center gap-1">
                    <Diamond className="w-3.5 h-3.5" />
                    {selectedOption.diamonds} {selectedOption.bonus > 0 && <span className="text-green-400 text-xs ml-1">(赠 {selectedOption.bonus})</span>}
                  </span>
                </div>
              </div>

              {/* 支付按钮状态切换 */}
              {isSuccess ? (
                <button disabled className="w-full py-4 bg-green-600 text-white font-bold rounded-xl flex justify-center items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" /> 支付成功
                </button>
              ) : isProcessing ? (
                <button disabled className="w-full py-4 bg-red-600/50 text-white font-bold rounded-xl flex justify-center items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> 处理中...
                </button>
              ) : (
                <button
                  onClick={executeRecharge}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-900/50 flex justify-center items-center gap-2"
                >
                  <CreditCard className="w-5 h-5" /> 确认支付
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
