import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import React from 'react';
import { useEffect } from 'react';
import { getPostDetail, getPostComments, commentOnPost } from '@/src/api/social';
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, Star, Send } from 'lucide-react';
import { scripts } from '@/src/data/scripts';
import { cn } from '@/lib/utils';
import { useBottomSheet } from '@/src/context/BottomSheetContext';

export default function PostDetail() {
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();

  const showPostActions = () => {
    showBottomSheet(
      <div className="p-4 flex flex-col gap-2">
        <div className="w-full text-center text-white font-bold mb-4">帖子操作</div>
        <button className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-white w-full text-left" onClick={() => { alert('链接已复制'); hideBottomSheet(); }}>
          <LinkIcon className="w-5 h-5 text-neutral-400" />
          复制链接
        </button>
        <button className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-red-500 w-full text-left" onClick={() => { alert('举报已提交'); hideBottomSheet(); }}>
          <Flag className="w-5 h-5 text-red-500" />
          举报该内容
        </button>
        {post?.authorId === localUser?.id && (
          <button className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-red-500 w-full text-left" onClick={() => { alert('帖子已删除'); navigate('-1'); hideBottomSheet(); }}>
            <Trash2 className="w-5 h-5 text-red-500" />
            删除帖子
          </button>
        )}
        <button className="w-full p-4 mt-2 bg-neutral-800 text-white rounded-xl active:scale-[0.98] transition-transform" onClick={hideBottomSheet}>取消</button>
      </div>
    );
  };
  const { id } = useParams();
  const navigate = useNavigate();

  // Real States
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const localUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchPostData = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const [resPost, resComments] = await Promise.all([
        getPostDetail(id),
        getPostComments(id).catch(() => ({ data: [] }))
      ]);
      setPost(resPost.data);
      setComments(resComments.data || []);
    } catch (e) {
      console.error(e);
      alert('帖子已被删除或加载失败');
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [id]);

  const [replyTarget, setReplyTarget] = useState<any>(null);
  const commentInputRef = React.useRef<HTMLInputElement>(null);

  const showCommentOptions = (comment: any) => {
    showBottomSheet(
      <div className="p-4 flex flex-col gap-2">
        <div className="w-full text-center text-white font-bold mb-4">评论操作</div>
        <button className="w-full p-4 bg-neutral-800 text-white rounded-xl active:scale-[0.98] transition-transform text-left"
          onClick={() => {
             hideBottomSheet();
             setReplyTarget(comment);
             setTimeout(() => commentInputRef.current?.focus(), 300);
          }}>
          回复 @{comment.user}
        </button>
        <button className="w-full p-4 bg-neutral-800 text-red-500 rounded-xl active:scale-[0.98] transition-transform text-left" onClick={() => { alert('举报已提交'); hideBottomSheet(); }}>举报评论</button>
        <button className="w-full p-4 mt-2 bg-neutral-800 text-white rounded-xl active:scale-[0.98] transition-transform" onClick={hideBottomSheet}>取消</button>
      </div>
    );
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return alert('评论内容不能为空');
    if (!localUser.id) return alert('请先登录');

    setIsSubmitting(true);
    try {
      await commentOnPost(id as string, { authorId: localUser.id, content: commentText });
      setCommentText('');
      // Optimistic update or refresh
      fetchPostData();
    } catch (e: any) {
      alert(e.response?.data?.message || '评论失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !post) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;
  }

  // Fallback map since we don't have direct script mapping on posts anymore, only in mock.
  const script = scripts.find(s => s.id === '1'); // Fallback purely for UI visual

  return (
    <div className="min-h-screen bg-neutral-950 pb-20">
      {/* Header */}
      <header className="bg-neutral-950 px-4 py-3 sticky top-0 z-40 flex items-center justify-between border-b border-neutral-800">
        <button onClick={() => { setReplyTarget(null); navigate(-1); }} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 active:scale-95 transition-transform" onClick={() => navigate(`/user/${post.authorId}`)}>
          <img src={(post.author?.avatar || `https://picsum.photos/seed/${post.authorId}/40/40`)} alt={(post.author?.nickname || '未知用户')} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
          <span className="font-bold text-white">{(post.author?.nickname || '未知用户')}</span>
        </div>
        <button onClick={showPostActions} className="p-2 -mr-2 text-neutral-400 hover:text-white transition-colors">
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
              <div key={idx} className={cn("w-1.5 h-1.5 rounded-full", idx === 0 ? "bg-red-900/200" : "bg-neutral-200")} />
            ))}
          </div>
        )}

        <div className="p-4">
          <p className="text-white leading-relaxed whitespace-pre-wrap text-justify">
            {post.content}
          </p>
          <div className="text-xs text-neutral-400 mt-3">{(new Date(post.createdAt).toLocaleString())}</div>

          {/* Linked Script */}
          {script && (
            <Link to={`/script/${script.id}`} className="flex items-center gap-3 bg-neutral-900 p-3 rounded-xl mt-4 border border-neutral-800 active:scale-[0.98] transition-transform">
              <img src={script.cover} alt={script.title} className="w-12 h-16 object-cover rounded-lg" referrerPolicy="no-referrer" />
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-bold text-white truncate">{script.title}</h5>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-yellow-600 font-bold">{(post.rating || 9.0)}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-200">
                    {script.difficulty}
                  </span>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-red-900/20 text-red-400 text-xs font-bold rounded-full">
                去看看
              </div>
            </Link>
          )}
        </div>

        <div className="h-2 bg-neutral-900" />

        {/* Comments Section */}
        <div className="p-4">
          <h3 className="font-bold text-white mb-4 flex items-center gap-1">
            共 {comments.length} 条评论
          </h3>
          
          <div className="space-y-5">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3 active:bg-neutral-900/50 p-2 -mx-2 rounded-xl transition-colors" onClick={() => showCommentOptions(comment)}>
                <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full object-cover shrink-0 active:scale-95 transition-transform" referrerPolicy="no-referrer" onClick={(e) => { e.stopPropagation(); navigate(`/user/${comment.authorId || 123}`); }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-neutral-500">{comment.user}</span>
                    <button className="flex items-center gap-1 text-neutral-400 hover:text-red-500 transition-colors">
                      <Heart className="w-3 h-3" />
                      <span className="text-[10px]">{comment.likes}</span>
                    </button>
                  </div>
                  <p className="text-sm text-white leading-relaxed">{comment.content}</p>
                  <div className="text-[10px] text-neutral-400 mt-1">{comment.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 px-4 py-3 flex items-center gap-4 z-40">
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            ref={commentInputRef}
            placeholder={replyTarget ? `回复 @${replyTarget.user}:` : "说点什么..."}
            className="w-full bg-neutral-100 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
          />
          <button 
            disabled={!commentText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-red-400 disabled:text-neutral-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-neutral-400">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={cn("flex items-center gap-1 transition-colors", isLiked && "text-red-500")}
          >
            <Heart className={cn("w-6 h-6", isLiked && "fill-red-500")} />
            <span className="text-xs font-medium">{(post.likes || 128) + (isLiked ? 1 : 0)}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            <Star className="w-6 h-6" />
          </button>
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
