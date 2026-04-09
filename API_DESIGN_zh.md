# 剧本杀系统 API 接口需求分析

本文档详细梳理了剧本杀业务中，移动端/C端App所需调用的接口，以及内部后台管理系统 (Admin Panel) 所需的接口。

## 一、前端 App 需求接口 (C 端)

前端主要围绕“玩家找本”、“交友社区”、“在线组局”、“游戏核心流转”等功能展开。

### 1. 用户与鉴权模块 (User & Auth)
*   `POST /api/auth/register`: 用户注册（手机号/邮箱/验证码）。
*   `POST /api/auth/login`: 用户登录，返回 JWT Token。
*   `GET /api/user/profile`: 获取当前登录用户的个人信息、战绩、成就、钱包资产。
*   `PUT /api/user/profile`: 更新个人资料（头像、昵称、个性签名）。
*   `GET /api/user/inventory`: 获取用户的背包道具（钥匙、卡片等）。

### 2. 剧本库与发现模块 (Scripts & Discover)
*   `GET /api/scripts`: 分页获取剧本列表（支持按标签、人数、难度筛选）。
*   `GET /api/scripts/:id`: 获取单个剧本的详情（简介、角色列表、评价、预计时长）。
*   `GET /api/scripts/:id/reviews`: 获取剧本的玩家评价列表。

### 3. 大厅与组局模块 (Lobby & Room)
*   `GET /api/rooms`: 获取当前正在招募玩家的大厅房间列表。
*   `POST /api/rooms/create`: 创建一个新房间（选择剧本、设置房间属性：公开/私密）。
*   `POST /api/rooms/:id/join`: 玩家请求加入房间（加入后切换至 WebSocket 实时同步）。
*   `POST /api/rooms/:id/leave`: 玩家离开房间。

### 4. 社交与消息模块 (Social & Messages)
*   `GET /api/friends`: 获取好友列表及当前在线/游戏状态。
*   `POST /api/friends/request`: 发送好友请求。
*   `POST /api/friends/handle`: 同意或拒绝好友请求。
*   `GET /api/messages/conversations`: 获取用户的聊天会话列表（包括系统通知、群组、私聊）。
*   `GET /api/messages/:conversationId`: 分页拉取某个特定会话的历史消息记录。

### 5. 社区广场模块 (Community)
*   `GET /api/posts`: 获取社区帖子列表。
*   `POST /api/posts`: 发布组局贴、避雷贴或剧情讨论贴。
*   `POST /api/posts/:id/comment`: 评论他人的帖子。

*(注：游戏中的实时剧本阅读、搜证抽卡、语音聊天、投票逻辑主要通过 WebSocket/Socket.io 信令实时交互，这里不再赘述传统的 HTTP API)。*

---

## 二、后台管理系统需求接口 (Admin Panel / B 端)

后台管理系统主要面向剧本杀平台运营人员，重点在于内容管理、用户生态管控以及数据统计。

### 1. 数据大盘概览 (Dashboard)
*   `GET /api/admin/dashboard/stats`: 获取核心运营指标（今日日活 DAU、同时在线房间数、新注册用户数、总营收等）。
*   `GET /api/admin/dashboard/charts`: 获取各类图表数据（如剧本热度趋势、用户留存趋势）。

### 2. 用户管理模块 (User Management)
*   `GET /api/admin/users`: 分页查询用户列表（支持按封禁状态、手机号、注册时间筛选）。
*   `GET /api/admin/users/:id`: 查看特定用户的详细数据（消费记录、开局历史、被举报记录）。
*   `POST /api/admin/users/:id/ban`: 封禁/解封用户账号，支持设置封禁时长。
*   `POST /api/admin/users/:id/grant`: 赠送/扣除用户的虚拟资产或道具（客诉补偿）。

### 3. 剧本内容管理 (Script Content Management)
*   `GET /api/admin/scripts`: 获取平台上架/下架的所有剧本列表。
*   `POST /api/admin/scripts`: 录入新的剧本信息（包括元数据、剧本流程 JSON、线索配置、地图素材配置等）。
*   `PUT /api/admin/scripts/:id`: 编辑剧本信息。
*   `POST /api/admin/scripts/:id/toggle-status`: 切换剧本的上架/下架状态。

### 4. 房间与游戏监控 (Room Monitoring)
*   `GET /api/admin/rooms/active`: 获取当前正在进行的房间列表。
*   `GET /api/admin/rooms/:id/logs`: 获取某个房间的系统操作日志或聊天记录流水（用于判定挂机或违规举报判定）。
*   `POST /api/admin/rooms/:id/dismiss`: 强制解散问题房间（如涉黄涉暴，或服务器卡死）。

### 5. 社区审核模块 (Content Audit)
*   `GET /api/admin/audit/posts`: 获取待审核或被举报的社区帖子列表。
*   `POST /api/admin/audit/posts/:id/action`: 处理举报（删除帖子、忽略举报、警告发帖人）。
*   `GET /api/admin/audit/reviews`: 获取剧本评论区的审核列表。

### 6. 系统与运营配置 (System & Operations)
*   `GET /api/admin/notices`: 获取系统公告/轮播图配置列表。
*   `POST /api/admin/notices`: 发布全服系统广播或横幅。
*   `GET /api/admin/store/items`: 管理商店出售的虚拟道具列表与定价。

---

## 三、DM (主持人) 专用接口需求

剧本杀 DM（主持人）在游戏中拥有上帝视角，需要能够自由把控游戏进度和玩家行为。以下是供 DM 客户端或界面专用的接口。

### 1. 房间把控与上帝视角
*   `GET /api/dm/rooms/:id/state`: 获取房间的上帝视角全景状态（包括所有玩家隐藏的线索、真实的身份底牌、当前实际进行阶段）。
*   `POST /api/dm/rooms/:id/phase`: DM 手动修改/推进游戏当前阶段（例如：强行从搜证环节进入圆桌讨论环节）。

### 2. 玩家状态管理
*   `POST /api/dm/rooms/:id/players/:playerId/status`: DM 手动更改玩家状态（如强制禁言、踢出房间或标记角色为“死亡”）。

### 3. 线索与道具调控
*   `POST /api/dm/rooms/:id/clues/distribute`: DM 手动向指定玩家发放特定线索（例如触发了隐藏剧情后发放彩蛋线索）。
*   `POST /api/dm/rooms/:id/clues/revoke`: DM 强制收回玩家手上的特定线索。
