# 剧本杀系统 API 接口需求分析 (完整商用版)

本文档详细梳理了剧本杀业务中，移动端/C端App所需调用的接口，内部后台管理系统 (Admin Panel) 所需的接口，以及剧本主持人 (DM) 的专属接口。

## 一、前端 App 需求接口 (C 端)

### 1. 用户与鉴权模块 (User & Auth)
*   `POST /api/auth/register`: 用户注册（手机号/邮箱/验证码）
*   `POST /api/auth/login`: 用户登录
*   `POST /api/auth/logout`: 用户登出
*   `POST /api/auth/refresh-token`: 刷新鉴权 Token
*   `GET /api/user/profile`: 获取当前登录用户个人信息
*   `PUT /api/user/profile`: 更新个人资料（头像、昵称、签名等）
*   `GET /api/user/inventory`: 获取用户的背包道具
*   `GET /api/user/achievements`: 获取用户已解锁的成就与勋章

### 2. 剧本库与发现模块 (Scripts & Discover)
*   `GET /api/scripts`: 分页获取剧本列表（支持多维度筛选）
*   `GET /api/scripts/recommend`: 获取首页个性化推荐剧本
*   `GET /api/scripts/hot`: 获取热门剧本榜单
*   `GET /api/scripts/:id`: 获取剧本详情
*   `GET /api/scripts/:id/reviews`: 获取剧本评价列表
*   `POST /api/scripts/:id/reviews`: 对已玩过的剧本发表评价
*   `POST /api/scripts/:id/favorite`: 收藏或取消收藏剧本

### 3. 大厅与组局模块 (Lobby & Room)
*   `GET /api/rooms`: 获取当前大厅招募房间列表
*   `POST /api/rooms/create`: 创建新房间
*   `POST /api/rooms/quick-match`: 快速匹配（按意向剧本类型随机分配房间）
*   `POST /api/rooms/:id/join`: 玩家加入房间
*   `POST /api/rooms/:id/leave`: 玩家离开房间
*   `GET /api/rooms/:id/members`: 获取房间内当前玩家信息
*   `POST /api/rooms/:id/invite`: 邀请好友加入当前房间
*   `POST /api/rooms/:id/ready`: 玩家准备/取消准备状态

### 4. 社交与消息模块 (Social & Messages)
*   `GET /api/friends`: 获取好友列表
*   `POST /api/friends/request`: 发送好友请求
*   `POST /api/friends/handle`: 处理好友请求（同意/拒绝）
*   `DELETE /api/friends/:id`: 删除好友
*   `GET /api/messages/conversations`: 获取消息会话列表
*   `GET /api/messages/:conversationId`: 获取历史消息
*   `POST /api/messages/send`: 发送单聊或群聊消息（兜底HTTP方案，主要靠WS）

### 5. 社区广场模块 (Community)
*   `GET /api/posts`: 获取社区帖子列表
*   `GET /api/posts/hot`: 获取社区热门/置顶帖子
*   `POST /api/posts`: 发布帖子
*   `GET /api/posts/:id`: 获取帖子详情
*   `POST /api/posts/:id/comment`: 评论帖子
*   `POST /api/posts/:id/like`: 点赞帖子/评论
*   `POST /api/posts/:id/report`: 举报违规帖子

### 6. 钱包与支付模块 (Wallet & Payment)
*   `GET /api/wallet/balance`: 查询钱包余额与金币
*   `GET /api/wallet/history`: 查询账单与交易流水
*   `POST /api/wallet/recharge`: 创建充值订单（拉起微信/支付宝支付）
*   `POST /api/wallet/withdraw`: 申请提现（实名认证用户收益提现）
*   `GET /api/wallet/order/:id`: 查询订单支付状态

### 7. 商城与道具模块 (Store)
*   `GET /api/store/items`: 获取商城在售道具、装扮列表
*   `POST /api/store/buy`: 购买道具/装扮
*   `POST /api/store/gift`: 购买并赠送道具给好友
*   `POST /api/store/redeem`: 使用兑换码获取礼包

### 8. 俱乐部/公会模块 (Clubs)
*   `GET /api/clubs`: 获取公会列表
*   `POST /api/clubs/create`: 消耗资产创建公会
*   `GET /api/clubs/:id`: 获取公会详情
*   `POST /api/clubs/:id/join`: 申请加入公会
*   `GET /api/clubs/:id/members`: 获取公会成员列表
*   `POST /api/clubs/:id/leave`: 退出公会

### 9. 客服与反馈 (Customer Service)
*   `POST /api/support/tickets`: 提交工单（Bug 反馈、投诉玩家、申诉）
*   `GET /api/support/tickets`: 查询我的工单进度
*   `GET /api/support/faq`: 获取常见问题解答列表

---

## 二、后台管理系统需求接口 (Admin Panel / B 端)

### 1. 数据大盘概览 (Dashboard)
*   `GET /api/admin/dashboard/stats`: 获取核心运营概览数据
*   `GET /api/admin/dashboard/charts`: 获取各类趋势图表数据
*   `GET /api/admin/dashboard/realtime`: 获取服务器实时负载与在线人数

### 2. 权限与角色管控 (RBAC)
*   `GET /api/admin/roles`: 获取后台角色配置列表
*   `POST /api/admin/roles`: 添加/编辑管理角色及其权限点
*   `GET /api/admin/managers`: 获取后台管理员账号列表
*   `POST /api/admin/managers`: 新增或禁用管理员账号

### 3. 用户与生态管理 (User Management)
*   `GET /api/admin/users`: 分页查询全平台用户列表
*   `GET /api/admin/users/:id`: 查看用户全方位数据图谱
*   `POST /api/admin/users/:id/ban`: 账号封禁处理
*   `POST /api/admin/users/:id/grant`: 手动发放/扣除虚拟资产
*   `GET /api/admin/users/:id/login-history`: 查看用户登录历史与IP记录

### 4. 剧本与内容管理 (Script Content)
*   `GET /api/admin/scripts`: 获取所有剧本列表
*   `POST /api/admin/scripts`: 录入新剧本元数据
*   `PUT /api/admin/scripts/:id`: 修改剧本属性
*   `POST /api/admin/scripts/:id/toggle-status`: 切换剧本上下架状态
*   `POST /api/admin/scripts/:id/upload-assets`: 上传剧本相关的线索图、地图、音频等素材

### 5. 财务与订单管理 (Finance & Orders)
*   `GET /api/admin/finance/orders`: 获取全平台充值与消费订单明细
*   `POST /api/admin/finance/orders/:id/refund`: 处理用户退款申请
*   `GET /api/admin/finance/withdrawals`: 获取 DM 或大V的提现申请列表
*   `POST /api/admin/finance/withdrawals/:id/audit`: 审批提现申请

### 6. 营销与活动中心 (Marketing)
*   `GET /api/admin/marketing/banners`: 获取 App 首页轮播图配置
*   `POST /api/admin/marketing/banners`: 更新轮播图
*   `GET /api/admin/marketing/coupons`: 获取优惠券/折扣活动列表
*   `POST /api/admin/marketing/coupons/issue`: 向全服或指定人群派发优惠券

### 7. 房间与监控 (Room Monitoring)
*   `GET /api/admin/rooms/active`: 获取正在进行的游戏房间
*   `GET /api/admin/rooms/:id/logs`: 查询指定房间的操作流日志与聊天流水
*   `POST /api/admin/rooms/:id/dismiss`: 强制安全解散异常房间

### 8. 社区审核模块 (Content Audit)
*   `GET /api/admin/audit/posts`: 获取待审核或被举报的社区贴
*   `POST /api/admin/audit/posts/:id/action`: 处理帖子违规（下架/屏蔽）
*   `GET /api/admin/audit/reviews`: 获取剧本评论区审核列表

### 9. 系统日志与安全 (System Logs)
*   `GET /api/admin/system/logs`: 获取管理员的操作审计日志
*   `GET /api/admin/system/errors`: 获取应用运行时的错误报警记录

---

## 三、DM (主持人) 专用接口需求

### 1. DM 个人工作台
*   `GET /api/dm/profile`: 获取 DM 资质、带本场次、评分与个人收益
*   `GET /api/dm/schedule`: 获取 DM 自己的排班与预约记录
*   `POST /api/dm/schedule/apply`: 提交带本排班申请
*   `POST /api/dm/withdraw`: DM 发起工资/小费提现申请

### 2. 强力控场与上帝视角
*   `GET /api/dm/rooms/:id/state`: 获取全局状态与所有人底牌
*   `POST /api/dm/rooms/:id/phase`: 手动流转游戏阶段
*   `POST /api/dm/rooms/:id/pause`: 暂停游戏（冻结所有人操作时间，如有人掉线或需要场外解释）
*   `POST /api/dm/rooms/:id/resume`: 恢复游戏进程
*   `POST /api/dm/rooms/:id/finish`: 强行结束游戏，进入结算页面

### 3. 玩家惩罚与控制
*   `POST /api/dm/rooms/:id/players/:playerId/status`: 更改玩家状态（标记死亡、复活）
*   `POST /api/dm/rooms/:id/players/:playerId/mute`: 强制禁言/解除禁言特定玩家
*   `POST /api/dm/rooms/:id/players/mute-all`: 开启/关闭全员禁言（DM发言模式）
*   `POST /api/dm/rooms/:id/players/:playerId/kick`: 踢出严重违规玩家

### 4. 线索与剧情调控
*   `POST /api/dm/rooms/:id/clues/distribute`: 定向私发线索
*   `POST /api/dm/rooms/:id/clues/revoke`: 强制收缴线索
*   `POST /api/dm/rooms/:id/audio/play`: 操控全房间播放特定 BGM 或恐怖音效
