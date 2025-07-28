import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WhatsappEvents } from '../../constants/whatsapp-client.constants';
import { WhatsappEventPayload } from '../../interfaces/whatsapp-client.interfaces';
import { DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';

@Injectable()
export class ConnectionHandlerService {
  private readonly _logger = new Logger(ConnectionHandlerService.name);
  constructor() {}

  @OnEvent(WhatsappEvents.CONNECTION_UPDATE)
  async handleConnectionUpdate(payload: WhatsappEventPayload<WhatsappEvents.CONNECTION_UPDATE>): Promise<void> {
    const { event, handler } = payload;
    const { connection, lastDisconnect, qr } = event;
    const disconnectionError = lastDisconnect?.error as Boom;

    if (qr) {
      this._logger.log('QR code received');
      return;
    }

    if (connection === 'close') {
      this._logger.log(`Connection closed: ${disconnectionError?.output?.statusCode}`);
      if (
        disconnectionError?.output?.statusCode !== DisconnectReason.loggedOut &&
        disconnectionError?.output?.statusCode !== DisconnectReason.connectionReplaced
      ) {
        this._logger.log('Reconnecting');
        handler.createConnection();
        return;
      }

      if (disconnectionError?.output?.statusCode === DisconnectReason.loggedOut) {
        this._logger.log('Logged out');
        return;
      }
    }

    if (connection === 'open') {
      this._logger.log('Connected');
    }
  }
}
