import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// ---------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------
export interface RoomPlayer {
  id: string; // socketId 或 userId
  userId: string;
  nickname: string;
  avatar: string;
  isReady: boolean;
  isMuted: boolean;
}

export interface RoomState {
  roomId: string | null;
  phase: string;
  players: RoomPlayer[];
  messages: any[];
  isConnected: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_CONNECTION'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'JOIN_ROOM_SUCCESS'; payload: { roomId: string; players: RoomPlayer[]; phase: string } }
  | { type: 'PLAYER_JOINED'; payload: RoomPlayer }
  | { type: 'PLAYER_LEFT'; payload: { userId: string } }
  | { type: 'PLAYER_STATE_UPDATE'; payload: { userId: string; isReady?: boolean; isMuted?: boolean } }
  | { type: 'PHASE_CHANGED'; payload: string }
  | { type: 'NEW_MESSAGE'; payload: any };

// ---------------------------------------------------------
// Reducer
// ---------------------------------------------------------
const initialState: RoomState = {
  roomId: null,
  phase: 'RECRUITING',
  players: [],
  messages: [],
  isConnected: false,
  error: null,
};

function roomReducer(state: RoomState, action: Action): RoomState {
  switch (action.type) {
    case 'SET_CONNECTION':
      return { ...state, isConnected: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'JOIN_ROOM_SUCCESS':
      return {
        ...state,
        roomId: action.payload.roomId,
        players: action.payload.players,
        phase: action.payload.phase,
        error: null,
      };
    case 'PLAYER_JOINED':
      // 避免重复添加
      if (state.players.some(p => p.userId === action.payload.userId)) return state;
      return { ...state, players: [...state.players, action.payload] };
    case 'PLAYER_LEFT':
      return { ...state, players: state.players.filter(p => p.userId !== action.payload.userId) };
    case 'PLAYER_STATE_UPDATE':
      return {
        ...state,
        players: state.players.map(p =>
          p.userId === action.payload.userId ? { ...p, ...action.payload } : p
        )
      };
    case 'PHASE_CHANGED':
      return { ...state, phase: action.payload };
    case 'NEW_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
}

// ---------------------------------------------------------
// Context Setup
// ---------------------------------------------------------
interface RoomContextProps {
  state: RoomState;
  dispatch: React.Dispatch<Action>;
  socket: Socket | null;
  joinRoom: (roomId: string, userId: string, nickname: string, avatar: string) => void;
  toggleReady: () => void;
}

const RoomContext = createContext<RoomContextProps | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(roomReducer, initialState);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // 初始化 Socket 连接 (假设通过 Vite 代理或者独立后端)
    const newSocket = io('http://localhost:4000', {
      autoConnect: false,
      reconnection: true,
    });

    newSocket.on('connect', () => dispatch({ type: 'SET_CONNECTION', payload: true }));
    newSocket.on('disconnect', () => dispatch({ type: 'SET_CONNECTION', payload: false }));
    newSocket.on('connect_error', (err) => dispatch({ type: 'SET_ERROR', payload: '无法连接到实时服务器: ' + err.message }));

    // 监听实时同步事件 (同后端的 server.ts 对应)
    newSocket.on('room:player-joined', (player) => dispatch({ type: 'PLAYER_JOINED', payload: player }));
    newSocket.on('room:player-left', ({ userId }) => dispatch({ type: 'PLAYER_LEFT', payload: { userId } }));
    newSocket.on('room:ready-changed', ({ userId, isReady }) => dispatch({ type: 'PLAYER_STATE_UPDATE', payload: { userId, isReady } }));
    newSocket.on('room:mute-changed', ({ userId, isMuted }) => dispatch({ type: 'PLAYER_STATE_UPDATE', payload: { userId, isMuted } }));
    newSocket.on('room:phase-changed', ({ phase }) => dispatch({ type: 'PHASE_CHANGED', payload: phase }));
    newSocket.on('room:message', (msg) => dispatch({ type: 'NEW_MESSAGE', payload: msg }));
    newSocket.on('error', (err) => dispatch({ type: 'SET_ERROR', payload: err.message || '未知房间错误' }));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = (roomId: string, userId: string, nickname: string, avatar: string) => {
    if (socket && !socket.connected) {
      socket.connect();
    }
    socket?.emit('join-room', { roomId, userId, nickname, avatar }, (response: any) => {
      if (response.error) {
        dispatch({ type: 'SET_ERROR', payload: response.error });
      } else {
        dispatch({
          type: 'JOIN_ROOM_SUCCESS',
          payload: { roomId, players: response.players, phase: response.phase }
        });
      }
    });
  };

  const toggleReady = () => {
    socket?.emit('toggle-ready');
  };

  return (
    <RoomContext.Provider value={{ state, dispatch, socket, joinRoom, toggleReady }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
};
