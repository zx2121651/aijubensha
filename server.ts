// 引入 express 用于提供基础的 HTTP API 和静态文件代理
import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const PORT = 3000;

  // Room state management
  // 房间状态管理：键为 roomId (房间ID)，值为该房间内所有用户的 Map 集合 (键为 socket.id, 值为用户详细数据)
  const rooms = new Map<string, Map<string, any>>();

  // 监听客户端连接事件，每当有一个新用户连接时触发
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 监听玩家加入房间事件
    // roomId: 目标房间ID; userProfile: 包含 peerId, name, avatar 的玩家基础信息
    socket.on("join-room", (roomId, userProfile) => {
      socket.join(roomId);
      
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map());
      }
      const room = rooms.get(roomId)!;
      
      const userData = {
        id: socket.id,
        peerId: userProfile.peerId,
        name: userProfile.name,
        avatar: userProfile.avatar,
        isMuted: true,
        status: 'online'
      };
      
      room.set(socket.id, userData);

      // 将当前房间内已存在的全部用户信息发送给这个刚加入的新用户
      // Send current users to the new user
      const usersInRoom = Array.from(room.values());
      socket.emit("room-users", usersInRoom);

      // 向房间内的其他所有用户广播：有一个新用户加入了
      // Broadcast to others that a new user joined
      socket.to(roomId).emit("user-joined", userData);

      // 监听用户断开连接事件（比如关闭网页或掉线）
      socket.on("disconnect", () => {
        room.delete(socket.id);
        if (room.size === 0) {
          rooms.delete(roomId);
        }
        io.to(roomId).emit("user-left", socket.id);
      });

      // 监听玩家切换麦克风静音状态的事件
      socket.on("toggle-mute", (isMuted) => {
        if (room.has(socket.id)) {
          const user = room.get(socket.id)!;
          user.isMuted = isMuted;
          room.set(socket.id, user);
          io.to(roomId).emit("user-muted", { userId: socket.id, isMuted });
        }
      });

      socket.on("update-status", (status) => {
        if (room.has(socket.id)) {
          const user = room.get(socket.id)!;
          user.status = status;
          room.set(socket.id, user);
          io.to(roomId).emit("user-status-changed", { userId: socket.id, status });
        }
      });

      // ================= WebRTC 信令服务 =================
      // 负责在两个对等端(Peer)之间转发 SDP(offer/answer) 和 ICE 候选信息
      // WebRTC Signaling
      socket.on("offer", (payload) => {
        io.to(payload.target).emit("offer", payload);
      });

      socket.on("answer", (payload) => {
        io.to(payload.target).emit("answer", payload);
      });

      socket.on("ice-candidate", (payload) => {
        io.to(payload.target).emit("ice-candidate", payload);
      });
    });
  });

  // 首先注册 API 路由。这里提供了一个健康检查接口
  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 区分环境：开发环境下注入 Vite 的中间件，支持模块热重载 (HMR)
  // 生产环境下则直接使用 express.static 提供打包后的静态资源
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
