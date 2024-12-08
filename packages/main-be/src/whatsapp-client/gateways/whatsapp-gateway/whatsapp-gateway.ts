import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ClientHandler } from '../../classes/client-handler';
import { Socket } from 'socket.io';
import { randomUUID } from 'crypto';

//TODO: configure cors
@WebSocketGateway({
  namespace: 'whatsapp',
  cors: true,
  origins: 'http://localhost:4200',
})
export class WhatsappGateway {
  @SubscribeMessage('start-session')
  async handleStartSession(
    @MessageBody() clientId: string,
    @ConnectedSocket() client: Socket,
  ) {
    let sessionID = clientId;
    if (!sessionID) {
      sessionID = randomUUID();
    }

    new ClientHandler(sessionID, client).createConnection();
    return;
  }
}
