import { Injectable } from '@nestjs/common';
import { ClientHandler } from '../../classes/client-handler';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WhatsappClientService {
  constructor(private readonly eventEmitter: EventEmitter2) {
    this.initializeClient();
  }

  private async initializeClient() {
    const handler = new ClientHandler(this.eventEmitter);

    await handler.createConnection();
  }
}
