import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService | null = null;

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000', {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
 }

  public joinChat(chatId: string) {
    if (this.socket) {
      this.socket.emit('join_chat', chatId);
    }
  }

  public leaveChat(chatId: string) {
    if (this.socket) {
      // Socket.io doesn't have a direct leave method, but we can emit an event
      // The server can handle this appropriately
    }
  }

  public sendTyping(chatId: string) {
    if (this.socket) {
      this.socket.emit('typing', { chatId });
    }
  }

  public sendStopTyping(chatId: string) {
    if (this.socket) {
      this.socket.emit('stop_typing', { chatId });
    }
  }

  public sendMessage(data: { chatId: string; message: any }) {
    if (this.socket) {
      this.socket.emit('send_message', data);
    }
  }
}

export default SocketService;
