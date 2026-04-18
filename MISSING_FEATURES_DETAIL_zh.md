# 剧本杀系统前端架构：剩余多级视图与业务功能缺失清单（极度详尽版）

本文档通过对比 `API_DESIGN_zh.md` 接口契约与当前前端工程（React Web `src/` 与 Flutter Mobile `flutter_app/`）的实际代码，梳理出所有尚未实现的多级页面、组件及底层交互逻辑，精确到对应的接口、状态及文件级别。

---

## 一、 俱乐部 / 公会系统 (Clubs) - 【双端缺失率：90%】

当前 React 端仅存在 `Clubs.tsx` 一级列表展示，缺乏完整的社群闭环。Flutter 端完全空白。

### 1. 公会详情多级页面
*   **前端路由**: `/club/:id` (缺失)
*   **关联接口**: `GET /api/clubs/:id`, `GET /api/clubs/:id/members`
*   **需要新建的文件**:
    *   `src/pages/club/ClubDetail.tsx`: 公会主页，使用渐变背景，展示公会等级、介绍、成员活跃度排行榜。
    *   `src/pages/club/ClubMembers.tsx`: 成员管理二级页（包含会长踢人、任命副会长的滑动操作）。
*   **沉浸式交互要求**:
    *   下拉时 Header 放大；上滑时吸顶显示公会缩略图。
    *   点击“加入公会”触发 `POST /api/clubs/:id/join`，成功后渲染粒子撒花特效。

### 2. 资产消耗与创建流程
*   **前端路由**: 弹窗无独立路由
*   **关联接口**: `POST /api/clubs/create`
*   **需要新建的组件**: `src/components/club/CreateClubBottomSheet.tsx`
*   **沉浸式交互要求**:
    *   表单：上传 Logo、填写公会名、公会口号。
    *   底部动作栏：显式提示“创建将消耗 1000 金币”。点击时调用钱包校验，若不足直接调起已有的 `RechargeBottomSheet`。

### 3. 公会专属实时对讲与聊天
*   **前端路由**: `/club/:id/chat` (缺失)
*   **需要新建的文件**: `src/pages/club/ClubChat.tsx`
*   **技术细节**: 类似现有的单聊页，但需接入群组 WebSocket 事件 `room:club-message`，并支持置顶公会拼车招募链接（点击链接直接跳入大厅 `RoomLobbyModal`）。

---

## 二、 商城、道具与赠礼闭环 (Store) - 【双端缺失率：80%】

当前仅有静态的 `Store.tsx` 橱窗和 `Inventory.tsx` 列表，没有跑通虚拟物品的消费与使用链路。

### 1. 道具穿戴与预览底抽屉
*   **目标位置**: `Inventory.tsx` 背包页面内
*   **需要新建的组件**: `src/components/store/ItemPreviewBottomSheet.tsx`
*   **交互逻辑**:
    *   点击背包中的“动态头像框”或“聊天气泡”，从下方滑出预览界面。
    *   上方展示当前用户佩戴该道具的实时效果预览。
    *   下方为“立即装备 / 卸下”操作按钮。

### 2. 跨层级打赏与赠礼面板
*   **目标位置**: 游戏结算页 (`Result.tsx`)、个人主页 (`UserProfile.tsx`)、剧本详情页评论区
*   **关联接口**: `POST /api/store/gift`
*   **需要新建的组件**: `src/components/store/GiftBottomSheet.tsx`
*   **交互逻辑**:
    *   在任何可以点击“送礼”图标的地方呼出此面板。
    *   展示一排小图标礼物列表（鲜花、跑车、穿云箭），带选中的缩放动效。
    *   下方显示目标玩家头像，确认后调用接口并播放全屏 SVGA 或 WebP 礼物特效动画。

### 3. 兑换码系统
*   **关联接口**: `POST /api/store/redeem`
*   **需要新建的组件**: `src/components/store/RedeemModal.tsx` (居中模态框即可)
*   **交互逻辑**: 键盘输入验证码，防抖校验，成功后弹出获得道具或金币的开箱动画。

---

## 三、 游戏内 AP (行动力) 搜证沙盘机制 - 【双端缺失率：100%】

当前 `Game.tsx` 虽然有“线索详情 (ClueDetailOverlay)”，但**缺乏线索的获取来源**。文档定义了地图与线索坐标。

### 1. 二维可交互大地图组件
*   **前端位置**: `Game.tsx` 中的 `activeTab === 'map'` 分支
*   **需要新建的文件**: `src/components/game/InvestigationMap.tsx`
*   **技术与交互要求**:
    *   外层包裹 `motion`，支持双指缩放拖拽（类似地图应用）。
    *   读取 `EditorSearchTarget` 数据，在底图特定坐标渲染“放大镜”呼吸灯特效图标。
    *   **核心逻辑**: 顶部状态栏显示玩家当前 AP 值。点击放大镜 -> 弹出确认框“消耗 1 AP 搜查此地？” -> 播放加载动效 -> 掉落线索卡片直接飞入下方背包 Tab。

---

## 四、 客户服务、设置与反馈 - 【双端缺失率：100%】

外围支撑系统完全缺失，直接影响商用闭环。

### 1. 客服与工单系统
*   **前端路由**: `/support` 及 `/support/ticket/:id`
*   **关联接口**: `POST /api/support/tickets`, `GET /api/support/tickets`
*   **需要新建的文件**:
    *   `src/pages/support/FaqList.tsx`: 常见问题手风琴折叠面板。
    *   `src/pages/support/TicketSubmit.tsx`: 包含问题类型下拉框、多行文本域及最多上传 3 张截图的图片选择器组件。
    *   `src/pages/support/TicketHistory.tsx`: 我提交的工单进度流转（待处理 -> 处理中 -> 已解决）。

### 2. 账号与隐私深层设置
*   **前端路由**: `/settings/account`, `/settings/privacy`
*   **需要新建的组件/页面**:
    *   手机号换绑/验证码组件 (`SmsVerificationModal`)。
    *   拉黑名单管理列表 (`Blacklist.tsx`)：支持解除拉黑操作。

---

## 五、 后台 B 端 (Admin Panel) 与创作者扩展 - 【双端缺失率：70%】

虽然第一阶段搭建了简单的 Admin 端和 Editor 骨架，但离完整的商业运营配置还差得很远。

### 1. 营销配置面板 (Admin)
*   **关联接口**: `GET /api/admin/marketing/banners`, `POST /api/admin/marketing/coupons/issue`
*   **需要补充的组件 (Admin 端)**:
    *   `BannerManager.tsx`: 可拖拽排序的轮播图上传与配置面板（定义跳转的关联剧本ID）。
    *   `CouponIssuer.tsx`: 优惠券大本营，支持输入条件（如新注册用户）点击“一键派发”。

### 2. 创作者多媒体素材库 (Editor)
*   **关联接口**: `POST /api/editor/projects/:id/assets/upload`
*   **需要补充的组件 (Creator 端)**:
    *   `src/pages/editor/AssetManagerDrawer.tsx`: 在编辑器右侧滑出的抽屉。
    *   **核心功能**: 支持音频 (BGM/音效)、图片 (线索/背景) 的分片上传与预览试听。拖拽素材直接放入左侧画布的特定节点（如事件触发节点）内。

### 3. 全局对局大盘与巡场 (Admin)
*   **关联接口**: `GET /api/admin/rooms/active`, `GET /api/admin/rooms/:id/logs`
*   **需要补充的组件**:
    *   `RoomMonitor.tsx`: 类似网吧管理系统，平铺展示当前所有开局的房间卡片。点击可查看实时 Socket.io 消息日志流，并提供“强制封停解散”的最高权限红色按钮。

---

## 结语与执行建议

如果我们要继续补齐这套完整的系统，建议按照以下优先级进行开发：
1. **最高优先级**：攻克**游戏内的 AP 搜证沙盘 (InvestigationMap)**。它是剧本杀最核心的交互差异点。
2. **第二优先级**：实现**商城赠礼与兑换码系统**。这是 C 端跑通商业化闭环和裂变的必备工具。
3. **第三优先级**：搭建**俱乐部公会系统**。用于巩固中长期玩家的留存与社交。
4. **低优先级**：补齐客服工单系统和 Admin 营销管理面板。
