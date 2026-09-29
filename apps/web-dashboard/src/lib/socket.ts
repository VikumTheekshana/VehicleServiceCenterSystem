import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5050';
    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('⚡ [AutoOS WebSocket] Connected with ID:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ [AutoOS WebSocket] Disconnected:', reason);
    });
  }

  return socket;
};
