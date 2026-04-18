import React, { useState } from 'react';
import { ArrowLeft, MessageSquareWarning, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '@/src/components/common/ImageUploader';

const TICKET_TYPES = [
  { id: 'bug', label: '游戏卡顿/闪退/Bug' },
  { id: 'recharge', label: '充值/消费异常' },
  { id: 'report', label: '投诉违规玩家/DM' },
  { id: 'script', label: '剧本错别字/逻辑硬伤反馈' },
  { id: 'other', label: '其他建议' },
];

export default function TicketSubmit() {
  const navigate = useNavigate();
  const [type, setType] = useState(TICKET_TYPES[0].id);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('请详细描述您遇到的问题');
      return;
    }

    setIsSubmitting(true);
    // 模拟接口提交延迟
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-2xl font-black mb-2">反馈提交成功</h2>
        <p className="text-neutral-400 text-center mb-8">我们已收到您的问题描述，客服小姐姐将尽快为您核实处理。您可以在系统通知中查看处理进度。</p>
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 bg-red-600 rounded-full font-bold active:scale-95 transition-transform"
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-24">
      {/* Header */}
      <header className="bg-neutral-950 px-4 py-3 sticky top-0 z-40 flex items-center gap-3 border-b border-neutral-900">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors active:scale-95">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="font-bold text-base flex-1">意见反馈</span>
        <button className="text-xs text-neutral-500 font-bold active:scale-95">历史工单</button>
      </header>

      <main className="p-4 flex flex-col gap-6">
        {/* Type Selection */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-neutral-300 flex items-center gap-2">
              <MessageSquareWarning className="w-4 h-4 text-red-500" />
              请选择问题分类
            </h3>
            <span className="text-[10px] text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded font-bold">必填</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {TICKET_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition-colors active:scale-95 flex items-center justify-center ${
                  type === t.id
                    ? 'bg-red-600/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.1)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Content Input */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-neutral-300">问题描述</h3>
            <span className="text-[10px] text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded font-bold">必填</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 focus-within:border-red-500/50 rounded-xl p-3 transition-colors">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请详细描述您遇到的问题、操作步骤或产生错误的场景，至少10个字..."
              className="w-full bg-transparent text-sm text-white resize-none h-32 focus:outline-none placeholder:text-neutral-600"
              maxLength={500}
            />
            <div className="text-right text-[10px] text-neutral-500 mt-2">{content.length} / 500</div>
          </div>
        </section>

        {/* Image Uploader */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-neutral-300">截图凭证</h3>
            <span className="text-[10px] text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded font-bold">选填</span>
          </div>
          <p className="text-xs text-neutral-500 mb-3">请提供问题页面的相关截图，支持最多 9 张图片</p>
          <ImageUploader images={images} onChange={setImages} maxCount={9} />
        </section>

        {/* Contact Info */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-neutral-300">联系方式</h3>
            <span className="text-[10px] text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded font-bold">选填</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 focus-within:border-red-500/50 rounded-xl px-4 py-1 transition-colors flex items-center">
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="留下您的微信号或手机号，方便我们与您联系..."
              className="flex-1 bg-transparent border-none outline-none py-3 text-sm text-white placeholder:text-neutral-600"
            />
          </div>
        </section>
      </main>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-900 p-4 z-40 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || content.length < 10}
          className="w-full py-4 rounded-full font-black text-lg transition-all active:scale-[0.98] disabled:scale-100 flex items-center justify-center gap-2 bg-red-600 text-white disabled:bg-neutral-800 disabled:text-neutral-500 shadow-[0_4px_20px_rgba(220,38,38,0.4)] disabled:shadow-none"
        >
          {isSubmitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '提交反馈'}
        </button>
      </div>
    </div>
  );
}
