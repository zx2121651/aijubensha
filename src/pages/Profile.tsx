import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, History, Heart, Star, Edit3, LogOut, Trophy, Target, User, X, Check, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserProfile, updateUserProfile } from '@/src/api/user';
import { motion, AnimatePresence } from 'motion/react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');
  const navigate = useNavigate();

  // State to hold the real user profile data
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State for the Edit BottomSheet Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Local storage user object (for the ID and basic offline fallback)
  const localUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchProfile = async () => {
    if (!localUser?.id) {
      navigate('/auth');
      return;
    }
    setIsLoading(true);
    try {
      const res = await getUserProfile(localUser.id);
      setProfileData(res.data);
      setEditNickname(res.data.nickname);
      setEditAvatar(res.data.avatar || `https://picsum.photos/seed/${res.data.id}/150/150`);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const handleSaveProfile = async () => {
    if (!editNickname.trim()) return alert('昵称不能为空');
    setIsSaving(true);
    try {
      await updateUserProfile({
        userId: localUser.id,
        nickname: editNickname,
        avatar: editAvatar
      });
      // 局部更新成功，重拉数据
      await fetchProfile();
      // 同步到本地缓存
      localStorage.setItem('user', JSON.stringify({
        ...localUser,
        nickname: editNickname,
        avatar: editAvatar
      }));
      setIsEditModalOpen(false);
      // Optional: show a quick success toast
      alert('资料更新成功！');
    } catch (err: any) {
      alert(err.response?.data?.message || '保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white pb-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white pb-20">
        <div className="text-center">
          <p className="text-neutral-500 mb-4">加载用户信息失败</p>
          <button onClick={() => navigate('/auth')} className="text-red-500 hover:underline">重新登录</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-24 font-sans relative">
      {/* 顶部背景装饰 */}
      <div className="h-48 bg-gradient-to-br from-red-900/40 via-neutral-900 to-neutral-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="px-6 -mt-16 relative z-10">
        {/* 用户信息卡片 */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative">
          <button
            onClick={() => navigate('/settings')}
            className="absolute top-4 right-4 p-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5 text-neutral-400" />
          </button>

          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
              <div className="w-24 h-24 rounded-full border-4 border-neutral-900 shadow-xl overflow-hidden bg-neutral-800">
                <img
                  src={profileData.avatar || `https://picsum.photos/seed/${profileData.id}/150/150`}
                  alt={profileData.nickname}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-black mt-4 tracking-tight flex items-center gap-2">
              {profileData.nickname}
            </h2>
            <p className="text-neutral-500 text-xs mt-1 bg-neutral-950 px-3 py-1 rounded-full border border-neutral-800">
              UID: {profileData.id.split('-')[0]}
            </p>

            <p className="text-neutral-400 text-sm mt-4 text-center px-4 line-clamp-2">
              {profileData.bio || '这个剧本人很懒，还没有写个性签名...'}
            </p>

            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="mt-4 text-xs font-bold text-red-400 bg-red-500/10 px-4 py-2 rounded-full flex items-center gap-1 hover:bg-red-500/20 transition-colors"
            >
              <Edit3 className="w-3 h-3" /> 编辑资料
            </button>

            {/* 核心数据统计 */}
            <div className="grid grid-cols-3 gap-4 w-full mt-8 pt-6 border-t border-neutral-800/50">
              <div className="text-center">
                <p className="text-2xl font-black text-white">{profileData.stats?.played || 0}</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">参与对局</p>
              </div>
              <div className="text-center relative">
                <div className="absolute inset-y-0 -left-2 w-px bg-neutral-800/50" />
                <p className="text-2xl font-black text-white">{profileData.stats?.mvp || 0}</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">获得MVP</p>
                <div className="absolute inset-y-0 -right-2 w-px bg-neutral-800/50" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">{profileData.stats?.reviews || 0}</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">撰写长评</p>
              </div>
            </div>
          </div>
        </div>

        {/* 商业与社交快捷入口 */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Link to="/wallet" className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex items-center gap-3 hover:bg-neutral-800/80 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm">我的钱包</h3>
              <p className="text-xs text-neutral-500">充值与流水</p>
            </div>
          </Link>
          <Link to="/inventory" className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex items-center gap-3 hover:bg-neutral-800/80 transition-colors">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm">个性装扮</h3>
              <p className="text-xs text-neutral-500">头像框气泡</p>
            </div>
          </Link>
        </div>

        {/* 底部退出登录 */}
        <button 
          onClick={handleLogout}
          className="w-full mt-8 p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-2xl flex justify-center items-center gap-2 text-red-500 font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" /> 退出当前账号
        </button>
      </div>

      {/* ================= 半屏编辑资料抽屉 ================= */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isSaving && setIsEditModalOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-neutral-900 border-t border-neutral-800 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-red-500" /> 编辑个人资料
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                  className="p-2 hover:bg-neutral-800 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              <div className="space-y-6 mb-8">
                {/* 头像预览与输入 (简化处理，支持直接填URL或者随机生成) */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-neutral-800 overflow-hidden bg-neutral-800 shrink-0">
                    <img src={editAvatar || `https://picsum.photos/seed/${profileData.id}/150/150`} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="text-xs font-medium text-neutral-400 ml-1">头像图片链接 (URL)</label>
                    <input
                      type="text"
                      value={editAvatar}
                      onChange={e => setEditAvatar(e.target.value)}
                      placeholder="填入 http://..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-400 ml-1">展示昵称</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={editNickname}
                    onChange={e => setEditNickname(e.target.value)}
                    placeholder="给自己起个霸气的推理名"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors font-medium"
                  />
                  <p className="text-[10px] text-neutral-600 text-right mt-1">{editNickname.length}/16</p>
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> 保存修改</>}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
