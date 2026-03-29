/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat.dto';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map lưu userId → socketId
  private connectedUsers = new Map<string, string>();

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  // Khi user kết nối WebSocket
  async handleConnection(client: Socket) {
    try {
      // Lấy token từ header
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      // Verify token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET as string,
      });

      // Lưu userId vào socket data
      client.data.userId = payload.sub;
      client.data.fullName = payload.fullName;

      // Lưu vào map
      this.connectedUsers.set(payload.sub, client.id);

      console.log(`✅ User ${payload.sub} connected — socket: ${client.id}`);
    } catch {
      client.disconnect();
    }
  }

  // Khi user ngắt kết nối
  handleDisconnect(client: Socket) {
    if (client.data.userId) {
      this.connectedUsers.delete(client.data.userId);
      console.log(`❌ User ${client.data.userId} disconnected`);
    }
  }

  // Vào phòng chat (join conversation room)
  @SubscribeMessage('join_conversation')
  handleJoin(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(conversationId);
    console.log(
      `User ${client.data.userId} joined conversation ${conversationId}`,
    );
    return { success: true };
  }

  // Rời phòng chat
  @SubscribeMessage('leave_conversation')
  handleLeave(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(conversationId);
    return { success: true };
  }

  // Gửi tin nhắn realtime
  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Lưu vào database
      const message = await this.chatService.saveMessage(
        client.data.userId,
        dto,
      );

      // Gửi tin nhắn đến tất cả user trong conversation room
      this.server.to(dto.conversationId).emit('new_message', message);

      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Đang gõ...
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // Gửi cho các user khác trong conversation
    client.to(conversationId).emit('user_typing', {
      userId: client.data.userId,
    });
  }

  // Dừng gõ
  @SubscribeMessage('stop_typing')
  handleStopTyping(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(conversationId).emit('user_stop_typing', {
      userId: client.data.userId,
    });
  }
}
