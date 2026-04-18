# 剧本杀前端架构：外围系统与多级视图缺失功能深度剖析（骨灰级技术落地版）

在完成了主流程（组局、社交、沉浸式对讲、线索查看）后，我们需要正视当前架构中**完全空白或仅具雏形**的 5 大外围系统。
以下是针对这些缺失页面的**组件树层级结构、状态管理映射、CSS 动效要求、以及接口对接字段**的极其详尽的解剖。

---

## 缺失模块一：俱乐部 / 公会系统 (Clubs) 全链路

当前 `src/pages/Clubs.tsx` 只是一个硬编码的 `List`。缺失的是一套完整的“公会社群运营闭环”。

### 1.1 `ClubDetail.tsx` (公会主页) - 多级页面
**组件层级与交互 (DOM Tree)**:
*   `div.min-h-screen.bg-neutral-950`
    *   `motion.header.sticky`: 包含 `ArrowLeft`, `Share2`, `MoreHorizontal`。滚动时背景高斯模糊（`backdrop-blur-md`）透明度从 0 -> 1。
    *   `div.relative.h-64`: 公会宣传大图。
        *   `img.object-cover`
        *   `div.bg-gradient-to-t.from-neutral-950`
    *   `div.px-4.-mt-12.z-10`: 悬浮信息面板
        *   `img.w-20.h-20.rounded-2xl`: 公会 Logo (圆角矩形，有别于用户的圆形头像)。
        *   `h1.text-2xl.font-black`: 公会名称 + `span.bg-red-600.text-xs` (公会等级 Lv.5)
        *   `p.text-sm.text-neutral-400.line-clamp-2`: 公会宣言。
    *   `div.flex.gap-4`: 数据统计区（活跃度 9800 | 成员 142/200 | 排名 No.3）
    *   `button.w-full.bg-red-600`: **申请加入 / 退出公会** (根据当前用户的 `clubId` 状态互斥渲染)。
    *   `Tabs (动态 / 成员 / 公告)`: 下方接不同的 TabView 区域。

**状态管理 (State/Context)**:
*   `const { id } = useParams()`
*   `const [clubData, setClubData] = useState<ClubDetail | null>(null)`
    *   所需字段：`{ id, name, logo, description, level, maxMembers, currentMembers, ownerId, isJoined, heatValue }`
*   **API 绑定**: `GET /api/clubs/:id`

### 1.2 `CreateClubBottomSheet.tsx` (创建公会表单抽屉)
**组件层级与交互 (DOM Tree)**:
*   包裹在全局 `BottomSheet` 内，呼出高度约 `80vh`。
*   `div.flex.flex-col.gap-4.p-4`
    *   `ImagePicker`: 上传公会 Logo (触发 `POST /api/upload`)。
    *   `input.bg-neutral-900.rounded-xl`: 公会名称 (支持正则限制长度和敏感词)。
    *   `textarea.bg-neutral-900.h-24`: 公会宣言。
    *   `div.flex.justify-between.bg-red-900/20`: 资产消耗提示区，展示所需消耗“1000 金币”及当前余额。
    *   `button.bg-red-600`: 确认创建。若余额不足，直接调出上一阶段做的 `RechargeBottomSheet`。

**状态管理 (State/Context)**:
*   `const [logoUrl, setLogoUrl] = useState('')`
*   `const [name, setName] = useState('')`
*   **API 绑定**: `POST /api/clubs/create`, Body: `{ name, description, logo }`

---

## 缺失模块二：商城与道具背包进阶交互 (Store & Inventory)

### 2.1 `ItemPreviewBottomSheet.tsx` (道具穿戴与预览底抽屉)
**组件层级与交互 (DOM Tree)**:
*   触发点：在 `Inventory.tsx` 的九宫格中点击任意道具卡片。
*   `div.relative.h-[50vh].flex.flex-col`
    *   **特效预览区 (核心难点)**:
        *   如果是头像框：`div.relative.w-24.h-24.mx-auto.mt-8` > `img.rounded-full` (用户自己的真实头像) + `img.absolute.-inset-2` (选中的装扮相框，支持 WebP 动图)。
        *   如果是聊天气泡：渲染一个假的聊天框，展示用户设定的消息，背景替换为选中的气泡图。
    *   `h3.text-xl.font-black.text-center.mt-4`: 道具名称 (如“龙年限定金边”)
    *   `p.text-sm.text-neutral-500.text-center`: 道具描述属性与到期时间 (如“永久有效”)。
    *   `div.flex.gap-3.mt-auto`
        *   `button.bg-neutral-800`: 赠送他人 (呼出 2.2 的选人面板)。
        *   `button.bg-red-600`: 立即佩戴 / 卸下。

**状态管理 (State/Context)**:
*   传入参数：`Item { id, name, type (AVATAR_FRAME|BUBBLE|GIFT), imageUrl, expiresAt }`
*   **API 绑定**: `POST /api/user/equip-item`, Body: `{ itemId, type }`

### 2.2 `GiftBottomSheet.tsx` (跨层级的打赏与赠礼动效面板)
**组件层级与交互 (DOM Tree)**:
*   横向滑动的两排礼物列表 `GridView(crossAxisCount: 4, mainAxisSpacing: 10)`。
*   每个单元格包含：礼物缩略图、名称、所需金币数。选中时有黄底粗边框高亮。
*   底部展示：“赠送给: [头像] 玩家A” 结合数量选择器 (+/-)。
*   **动效难点 (Lottie / SVGA)**:
    *   点击“赠送”按钮，网络请求成功后。
    *   在顶层 DOM (通过 Portal 注入) 渲染一个全屏的无指针穿透的 `<canvas>`，播放如跑车、烟花的全屏撒钱特效持续 3 秒，然后淡出销毁。
*   **API 绑定**: `POST /api/store/gift`, Body: `{ senderId, receiverId, itemId, quantity }`

---

## 缺失模块三：游戏内的 AP (行动力) 搜证沙盘 (Game.tsx)

这是目前 `Game.tsx` 中最缺失的一环。它直接决定了这是个“看文字的静态网页”还是一个“剧本杀系统”。

### 3.1 `InvestigationMap.tsx` (二维搜证可交互底图)
**组件层级与交互 (DOM Tree)**:
*   替换 `Game.tsx` 中的 `activeTab === 'map'` 的占位符。
*   `div.relative.w-full.h-[60vh].overflow-hidden.bg-neutral-900`
    *   `motion.div.absolute`: 使用 `drag` 和 `whileDrag` 属性使地图底图可以在视口内平移，使用 `onWheel` 或多指手势实现缩放。
        *   `img.w-[1000px].h-[800px]`: 现场全景图。
        *   `EditorSearchTarget` 数组渲染: 在底图上的绝对定位 ( `left: {target.x}%, top: {target.y}%` ) 渲染出一排“发光的放大镜图标”。
            *   样式：`div.w-8.h-8.bg-red-600/50.rounded-full.animate-ping` + 居中的 `Search` 图标。

**状态管理 (State/Context)**:
*   `const [ap, setAp] = useState(5)` (当前剩余行动力)。
*   `const [investigationData, setInvestigationData] = useState(null)`
    *   所需字段：`{ mapUrl, targets: [{ id, name, x, y, clueId, isSearched }] }`
*   **点击触发链路**:
    1.  点击放大镜图标，弹出二次确认：“搜索【床底】，消耗 1 AP”。
    2.  确认后判断 AP 是否足够。若不足提示。
    3.  足够则触发 API：`POST /api/room/:id/investigate`, Body: `{ targetId }`
    4.  如果该地点藏有线索，弹出“你找到了 1 张照片”，并将线索推入玩家个人的 `unlockedClues` 数组。图标变灰且不可再点。

---

## 缺失模块四：客户服务与支持系统 (Support)

提升商用留存率的外围模块。

### 4.1 `TicketSubmit.tsx` (工单与Bug反馈提交页)
**组件层级与交互 (DOM Tree)**:
*   `div.p-4.bg-neutral-950`
    *   `h2.text-lg.font-bold`: 提交问题。
    *   **选择框组件 (`Select`)**: 选择问题类型分类（游戏卡顿 / 充值未到账 / 剧本错别字 / 投诉违规玩家）。
    *   **多行文本输入框**: 描述问题发生的具体场景。
    *   **图片上传器 (`ImageUploader.tsx`)**:
        *   一个 3x3 的网格布局，最多添加 3 张截图。
        *   包含点击唤起原生的相册/相机，选择后在前端通过 `FileReader` 压缩，并展示带小叉号 `X` 的缩略图。
    *   `button.w-full.bg-red-600`: 提交并返回历史记录。

**状态管理 (State/Context)**:
*   `const [type, setType] = useState('BUG')`
*   `const [content, setContent] = useState('')`
*   `const [images, setImages] = useState<File[]>([])`
*   **API 绑定**: `POST /api/support/tickets`, Multipart Form Data 上传。

---

## 缺失模块五：Admin 面板营销与创作者媒体库 (B 端深度扩建)

这些是提供给运营和剧本作者的核心组件。

### 5.1 `AssetManagerDrawer.tsx` (创作者多媒体素材管理器)
**组件层级与交互 (DOM Tree)**:
*   位置：在 `ProjectEditor.tsx` 中点击左侧工具栏“多媒体”图标后，从右侧滑出抽屉 (`w-80`)。
*   `div.flex.flex-col.h-full.bg-neutral-900.border-l`
    *   `div.p-4`: 切换 Tab：图片 (Image) / 音效 (Audio) / 视频 (Video)。
    *   `div.grid.grid-cols-2.gap-2.overflow-y-auto`: 素材瀑布流。
        *   如果是音频，渲染一个小波形图图标和一个 `PlayCircle`，点击使用 HTML5 `Audio` 试听。
    *   `div.p-4.border-t`: 大号虚线框上传区，支持点击或将电脑里的文件拖拽进入 (Drag & Drop API) 触发自动上传。

**状态管理 (State/Context)**:
*   **API 绑定**:
    *   `GET /api/editor/projects/:id/assets`
    *   `POST /api/editor/projects/:id/assets/upload` (携带 FormData)。

### 5.2 `RoomMonitor.tsx` (后台大盘与强制巡场系统)
**组件层级与交互 (DOM Tree)**:
*   位置：Admin Panel 侧边栏的“对局监控”菜单。
*   `div.grid.grid-cols-3`
    *   渲染所有处于 `phase !== 'FINISHED'` 的房间监控卡片。
    *   卡片字段：房间名、当前阶段、存活人数、开局时长（黄色警告表示已超时超过 5 小时）。
    *   **交互**: 点击卡片展开详情面板。
        *   左半边：实时打印该房间的 WebSocket `chat-message` 聊天记录滚动窗口（用于监控涉黄涉政）。
        *   右半边：两个高危操作按钮：“一键解散该房间（退还点数）”、“全员强制禁言”。
*   **API 绑定**:
    *   长链接 Socket 监听 `admin:room-logs`。
    *   `POST /api/admin/rooms/:id/dismiss`。
