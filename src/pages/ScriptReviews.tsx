import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { getScriptReviews } from '@/src/api/room'; // using same api or mock

export default function ScriptReviews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all'|'good'|'bad'>('all');
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mocking reviews since api might not return enough
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const res = await getScriptReviews(id as string).catch(() => ({ data: [] }));
        let data = res.data || [];
        if (data.length === 0) {
           data = Array.from({ length: 15 }).map((_, i) => ({
             id: `rev-${i}`,
             user: `玩家_${Math.floor(Math.random() * 1000)}`,
             avatar: `https://picsum.photos/seed/rev${i}/50/50`,
             rating: i % 4 === 0 ? 2 : (i % 2 === 0 ? 5 : 4),
             content: i % 4 === 0 ? '玩得有点累，线索太碎了，dm也没带好节奏。' : '本年度最佳！逻辑闭环太完美了，反转惊呆全场！',
             date: `2024-05-${(i % 30) + 1}`,
             likes: Math.floor(Math.random() * 50)
           }));
        }
        setReviews(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const filteredReviews = reviews.filter(r => {
    if (filter === 'good') return r.rating >= 4;
    if (filter === 'bad') return r.rating <= 3;
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-50 pb-safe">
      <header className="bg-white px-4 py-3 sticky top-0 z-40 flex flex-col border-b border-neutral-200">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-800 active:scale-95 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg text-neutral-900">全部评价 ({reviews.length})</span>
        </div>
        <div className="flex gap-3">
          {['all', 'good', 'bad'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-bold transition-colors border",
                filter === f ? "bg-neutral-900 text-white border-neutral-900" : "bg-neutral-100 text-neutral-600 border-transparent hover:bg-neutral-200"
              )}
            >
              {f === 'all' ? '全部' : f === 'good' ? '好评' : '中差评'}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center p-10"><div className="animate-spin w-8 h-8 border-b-2 border-red-600 rounded-full"/></div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center text-neutral-400 py-10">暂无该分类下的评价</div>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex gap-3">
              <img src={review.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer"/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-neutral-900">{review.user}</span>
                  <span className="text-[10px] text-neutral-400">{review.date}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-200")} />
                  ))}
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                  {review.content}
                </p>
                <div className="flex items-center justify-end gap-4 text-neutral-400">
                  <button className="flex items-center gap-1 active:scale-95 transition-transform hover:text-red-500">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs">{review.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 active:scale-95 transition-transform hover:text-blue-500">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs">回复</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
