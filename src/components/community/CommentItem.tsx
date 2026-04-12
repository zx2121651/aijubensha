import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Reply {
  id: string | number;
  authorId: string;
  user: string;
  avatar: string;
  content: string;
  toUser?: string; // 回复的目标用户
}

interface CommentProps {
  comment: any;
  onReplyClick: (target: any) => void;
}

export default function CommentItem({ comment, onReplyClick }: CommentProps) {
  const navigate = useNavigate();

  // 模拟一些自带的回复数据 (在实际开发中这通常从后端获取的 comment.replies 中来)
  const replies: Reply[] = comment.replies || (comment.id === '1' || comment.id === 1 ? [
    {
      id: 'r1',
      authorId: 'u2',
      user: '小红帽',
      avatar: 'https://picsum.photos/seed/reply1/40/40',
      content: '确实，当时我也被这个点感动了！'
    },
    {
      id: 'r2',
      authorId: 'u3',
      user: '硬核推理狂',
      avatar: 'https://picsum.photos/seed/reply2/40/40',
      content: '我倒觉得推演有点生硬',
      toUser: '小红帽'
    }
  ] : []);

  return (
    <div className="flex flex-col">
      {/* 根评论 */}
      <div className="flex gap-3 active:bg-neutral-900/50 p-2 -mx-2 rounded-xl transition-colors" onClick={() => onReplyClick(comment)}>
        <img
          src={comment.avatar}
          alt={comment.user}
          className="w-8 h-8 rounded-full object-cover shrink-0 active:scale-95 transition-transform"
          referrerPolicy="no-referrer"
          onClick={(e) => { e.stopPropagation(); navigate(`/user/${comment.authorId || 123}`); }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-neutral-500">{comment.user}</span>
            <button className="flex items-center gap-1 text-neutral-400 hover:text-red-500 transition-colors" onClick={(e) => e.stopPropagation()}>
              <Heart className="w-3 h-3" />
              <span className="text-[10px]">{comment.likes}</span>
            </button>
          </div>
          <p className="text-sm text-white leading-relaxed">{comment.content}</p>
          <div className="text-[10px] text-neutral-400 mt-1">{comment.time}</div>
        </div>
      </div>

      {/* 楼中楼回复 */}
      {replies.length > 0 && (
        <div className="ml-11 mt-1 flex flex-col gap-3 pl-3 border-l-2 border-neutral-800">
          {replies.map(reply => (
            <div
              key={reply.id}
              className="flex gap-2 active:bg-neutral-900/50 p-1 -mx-1 rounded-xl transition-colors"
              onClick={() => onReplyClick(reply)}
            >
              <img
                src={reply.avatar}
                className="w-5 h-5 rounded-full object-cover shrink-0 active:scale-95 transition-transform"
                alt="reply"
                onClick={(e) => { e.stopPropagation(); navigate(`/user/${reply.authorId}`); }}
              />
              <div className="flex-1 min-w-0">
                 <span className="text-xs font-bold text-neutral-500 mr-1">
                   {reply.user}
                   {reply.toUser && (
                     <>
                       <span className="text-neutral-600 font-normal mx-1">回复</span>
                       {reply.toUser}
                     </>
                   )}
                   :
                 </span>
                 <span className="text-xs text-white leading-relaxed">{reply.content}</span>
              </div>
            </div>
          ))}
          {replies.length >= 2 && (
             <button className="text-[10px] text-blue-500 font-bold mt-1 text-left w-fit active:opacity-50 transition-opacity">展开全部 12 条回复</button>
          )}
        </div>
      )}
    </div>
  );
}
