import { io, Socket } from 'socket.io-client';
import { API_URL } from './api';

export interface ChatSocketMessage {
  id: string;
  journeyId: string;
  content: string;
  sender?: {
    id: string;
    firstName?: string;
  };
  sentAt: string | Date;
  isRead?: boolean;
  type?: string;
}

let socketInstance: Socket | null = null;

export const connectChatSocket = async (): Promise<Socket> => {
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  const baseUrl = API_URL.replace(/\/api$/, '');
  socketInstance = io(baseUrl, {
    transports: ['websocket'],
    autoConnect: true,
  });

  return socketInstance;
};

export const joinJourneyRoom = async (journeyId: string) => {
  const socket = await connectChatSocket();
  socket.emit('joinRoom', { journeyId });
};

export const leaveJourneyRoom = async (journeyId: string) => {
  if (socketInstance) {
    socketInstance.emit('leaveRoom', { journeyId });
  }
};

export const disconnectChatSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
