# 剧本杀 App 项目代码架构分析报告

## 1. 项目概述

本项目是一个基于 Web 技术的实时在线剧本杀（Jubensha）应用。它允许用户在线组局、选择剧本、扮演角色，并提供实时的语音通讯和状态同步功能，同时涵盖了搜证、阅读剧本、讨论和投票等剧本杀核心游戏流程。

## 2. 技术栈概览

*   **前端框架**: React 19 + Vite
*   **路由**: React Router DOM v7 (构建单页应用 SPA)
*   **状态管理**: React Hooks (`useState`, `useEffect`, `useMemo`, `useRef` 等)
*   **样式方案**: Tailwind CSS v4 + 搭配 `clsx` 和 `tailwind-merge` 实现动态类名组合
*   **实时通讯**:
    *   **Socket.io**: 用于处理房间状态同步、聊天消息、游戏流程控制、线索发放等信令与状态实时广播。
    *   **WebRTC / PeerJS**: 用于实现玩家间的低延迟实时语音通话。
*   **动画库**: Motion (`motion/react`) 提供流畅的界面动画。
*   **图标库**: Lucide React
*   **后端服务**: Node.js + Express + Socket.io (结合 Vite middleware 提供全栈本地开发体验)

## 3. 核心目录与文件结构

```text
/
├── server.ts              # 后端服务入口：提供 Express 接口及 Socket.io 实时信令服务
├── vite.config.ts         # Vite 打包构建配置
├── src/
│   ├── main.tsx           # React 应用挂载入口
│   ├── App.tsx            # 前端路由中心配置
│   ├── index.css          # 全局样式（包含 Tailwind 引入）
│   ├── components/        # 公共组件复用区 (如 Layout, Modals)
│   ├── data/              # 静态数据与 Mock 数据
│   │   └── scripts.ts     # 剧本数据模型与硬编码数据 (Script, Character, Clue 接口)
│   └── pages/             # 业务页面视图组件
│       ├── Home.tsx       # 首页：展示剧本推荐、社区动态等
│       ├── Room.tsx       # 组局房间页：玩家加入、角色选择、准备状态管理
│       ├── Game.tsx       # 游戏核心页：包含剧本阅读、地图搜证、背包、聊天/语音频道、进度控制
│       ├── ScriptDetail.tsx # 剧本详情介绍页
│       ├── Auth.tsx       # 登录/认证页
│       └── ... (其他页面如 Profile, Discover 等)
```

## 4. 架构设计与核心逻辑分析

### 4.1. 前后端同构与开发模式
项目在 `server.ts` 中巧妙地结合了 Express 和 Vite。在开发模式下，Vite 作为中间件挂载到 Express 上，实现 HMR (热重载) 和前端资源服务；而在生产模式下，Express 将代理打包后的 `dist` 静态文件。这样的设计使得前后端可以在一个 Node 进程中启动，极大地简化了开发和部署流程。

### 4.2. 实时通讯模块设计 (Socket.io + WebRTC)
这是剧本杀应用的核心：
*   **房间状态管理**: `server.ts` 中的 `rooms` 字典在内存中管理房间实例。玩家通过 `join-room` 事件进入房间，服务端会广播当前所有玩家给新用户，并将新用户广播给其他人。
*   **玩家行为同步**: 包括麦克风状态切换 (`toggle-mute`)、在线/离开状态更新 (`update-status`)，这些状态实时广播保证了所有客户端 UI 的一致性。
*   **WebRTC 信令**: 虽然项目引入了 `PeerJS` 和 `simple-peer`，但 `server.ts` 也预留了基础的 WebRTC 信令转发事件（`offer`, `answer`, `ice-candidate`），为点对点音视频流建立连接提供中介服务。

### 4.3. 游戏核心业务流程 (Game.tsx)
`Game.tsx` 是最为复杂的页面组件，整合了剧本杀的多个阶段：
*   **多 Tab 布局**: 页面通过 `activeTab` 状态切换不同视图（剧本 `script`、线索 `clues`、物品 `inventory`、聊天 `chat` 等），使得在手机端屏幕有限的情况下能容纳庞大的信息量。
*   **游戏阶段流转 (`gamePhase`)**: 状态机思想，管理着从 `reading`（阅读阶段） -> `searching`（搜证阶段） -> `discussing`（圆桌讨论） -> `voting`（投票环节） -> `reveal`（复盘阶段）的流程。
*   **搜证系统 (`actionPoints`)**: 引入 AP (Action Points) 机制。前端通过解析 `scripts.ts` 中的线索并动态生成可交互的地图（`isMapModeOpen`）。搜证逻辑在前端模拟了抽取线索并发放的过程。
*   **私聊与公开消息 (`chatRecipient`)**: 聊天模块不仅支持全局广播，还支持点对点的私密信息，符合剧本杀中玩家私聊串供的真实场景需求。

### 4.4. 组队与准备机制 (Room.tsx)
*   **房主权限**: 首个进入或创建的人拥有 `isHost` 标志，可以决定何时强制开始游戏。
*   **防撞角逻辑**: 前端维护选角数组，如果一个角色（`selectedCharacterId`）已被其他用户选择，则按钮置灰不可选。

## 5. 总结

该项目架构清晰，利用了 React 最新的 Hooks 和 Vite 的高效构建，完成了一个结构完整的单页实时交互应用。其最大的亮点在于前端包揽了极高的业务复杂度（如多阶段控制、搜证小游戏、背包等），并通过 Socket.io 将多人状态紧密缝合，是一个具有相当完整度的 Web 端多人在线游戏原型。
