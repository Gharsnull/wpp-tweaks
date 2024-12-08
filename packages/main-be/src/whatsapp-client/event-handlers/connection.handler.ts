import { Boom } from '@hapi/boom';
import { ConnectionState, DisconnectReason } from '@whiskeysockets/baileys';
import { Logger } from 'pino';
import { Socket } from 'socket.io';

export const handleConntectionStateChange = (
  updateEvent: Partial<ConnectionState>,
  connectFn: () => void,
  connectedClient: Socket,
  uid: string,
  logger: Logger,
): void => {
  const { connection, lastDisconnect, qr } = updateEvent;

  const disconnectionError = lastDisconnect?.error as Boom;

  if (qr) {
    logger.info('QR code received');
    connectedClient.emit('qr', qr);
    return;
  }

  if (connection === 'close') {
    if (
      disconnectionError?.output?.statusCode !== DisconnectReason.loggedOut &&
      disconnectionError?.output?.statusCode !==
        DisconnectReason.connectionReplaced
    ) {
      logger.info('Reconnecting');
      connectFn();
      return;
    }

    if (disconnectionError?.output?.statusCode === DisconnectReason.loggedOut) {
      logger.info('Logged out');
      connectedClient.emit('logged-out');
      return;
    }
  }

  if (connection === 'open') {
    connectedClient.emit('connection-id', uid);
    console.log('Connected');
  }
};
