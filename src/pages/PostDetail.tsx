import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, Star, Send } from 'lucide-react';
import { scripts } from '@/src/data/scripts';
import { cn } from '@/lib/utils';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Mock post data based on ID
  const post = {
    id: id || 'p1',
    user: '推理狂魔',
    avatar: 'https://picsum.photos/seed/p1/40/40',
    time: '2小时前',
    scriptId: '1',
    rating: 9.5,
    content: '《林家大院》这个本真的太棒了！剧情反转再反转，完全猜不到结局。而且没有边缘角色，每个人的故事线都很饱满。强烈推荐给大家！\n\n最让我惊喜的是第二幕的搜证环节，机制设计得非常巧妙。DM的演绎也超级加分，特别是最后复盘的时候，鸡皮疙瘩都起来了。',
    likes: 128,
    comments: 32,
    images: ['https://picsum.photos/seed/post1/800/600', 'https://picsum.photos/seed/post2/800/600']
  };

  const script = scripts.find(s => s.id === post.scriptId);

  // Mock comments
  const comments = [
    { id: 'c1', user: '情感本爱好者', avatar: 'https://picsum.photos/seed/p2/32/32', time: '1小时前', content: '真的吗？我一直不敢玩恐怖本，这个吓人吗？', likes: 5 },
    { id: 'c2', user: '硬核老李', avatar: 'https://picsum.photos/seed/p3/32/32', time: '45分钟前', content: '推理部分确实不错，逻辑闭环做得很严密。', likes: 12 },
    { id: 'c3', user: '剧本杀萌新', avatar: 'https://picsum.photos/seed/p4/32/32', time: '10分钟前', content: '求组队！有人带带萌新吗？', likes: 1 },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-3 sticky top-0 z-40 flex items-center justify-between border-b border-neutral-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <img src={post.avatar} alt={post.user} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
          <span className="font-bold text-neutral-900">{post.user}</span>
        </div>
        <button className="p-2 -mr-2 text-neutral-600 hover:text-neutral-900 transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </header>

      {/* Post Content */}
      <main>
        {/* Images */}
        {post.images.length > 0 && (
          <div className="w-full overflow-x-auto snap-x snap-mandatory flex scrollbar-hide">
            {post.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`Post image ${idx + 1}`} 
                className="w-full h-[400px] object-cover snap-center shrink-0" 
                referrerPolicy="no-referrer" 
              />
            ))}
          </div>
        )}
        
        {/* Image Indicators */}
        {post.images.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {post.images.map((_, idx) => (
              <div key={idx} className={cn("w-1.5 h-1.5 rounded-full", idx === 0 ? "bg-red-500" : "bg-neutral-200")} />
            ))}
          </div>
        )}

        <div className="p-4">
          <p className="text-neutral-900 leading-relaxed whitespace-pre-wrap text-justify">
            {post.content}
          </p>
          <div className="text-xs text-neutral-400 mt-3">{post.time}</div>

          {/* Linked Script */}
          {script && (
            <Link to={`/script/${script.id}`} className="flex items-center gap-3 bg-neutral-50 p-3 rounded-xl mt-4 border border-neutral-100 active:scale-[0.98] transition-transform">
              <img src={script.cover} alt={script.title} className="w-12 h-16 object-cover rounded-lg" referrerPolicy="no-referrer" />
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-bold text-neutral-900 truncate">{script.title}</h5>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-yellow-600 font-bold">{post.rating}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
                    {script.difficulty}
                  </span>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                去看看
              </div>
            </Link>
          )}
        </div>

        <div className="h-2 bg-neutral-50" />

        {/* Comments Section */}
        <div className="p-4">
          <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-1">
            共 {post.comments} 条评论
          </h3>
          
          <div className="space-y-5">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-neutral-500">{comment.user}</span>
                    <button className="flex items-center gap-1 text-neutral-400 hover:text-red-500 transition-colors">
                      <Heart className="w-3 h-3" />
                      <span className="text-[10px]">{comment.likes}</span>
                    </button>
                  </div>
                  <p className="text-sm text-neutral-900 leading-relaxed">{comment.content}</p>
                  <div className="text-[10px] text-neutral-400 mt-1">{comment.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 py-3 flex items-center gap-4 z-40">
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="说点什么..." 
            className="w-full bg-neutral-100 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
          />
          <button 
            disabled={!commentText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-red-600 disabled:text-neutral-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-neutral-600">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={cn("flex items-center gap-1 transition-colors", isLiked && "text-red-500")}
          >
            <Heart className={cn("w-6 h-6", isLiked && "fill-red-500")} />
            <span className="text-xs font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-neutral-900 transition-colors">
            <Star className="w-6 h-6" />
          </button>
          <button className="flex items-center gap-1 hover:text-neutral-900 transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
