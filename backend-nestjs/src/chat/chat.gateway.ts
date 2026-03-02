import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token || client.handshake.headers?.authorization;

      console.log(client.handshake.headers);

      if (!token) {
        console.log('No token provided, disconnecting...');
        return client.disconnect();
      }

      const payload = await this.jwtService.verifyAsync(token);

      client.data.user = payload;
      console.log(`User ${payload.id} connected`);
    } catch (error) {
      console.log('error in jwt:', error);
      console.log('Invalid token, disconnecting...');
      client.disconnect();
    }
  }

  @SubscribeMessage('send_message')
  handleMessage(client: Socket, payload: { message: string }): void {
    const user = client.data.user;
    console.log(`Received message from user ${user.id}: ${payload.message}`);

    client.broadcast.emit('new_message', {
      username: user.user_name,
      text: payload.message,
      timestamp: new Date().toISOString(),
    });
  }
}
