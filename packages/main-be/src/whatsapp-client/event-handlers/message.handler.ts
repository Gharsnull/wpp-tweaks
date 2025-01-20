import {
  WAMessage,
  MessageUpsertType,
  WASocket,
} from '@whiskeysockets/baileys';
import { Logger } from 'pino';

export interface MessageEvent {
  messages: WAMessage[];
  type: MessageUpsertType;
  requestId?: string;
}

//TODO: implement
export const handleMessageEvent = async (
  event: MessageEvent,
  wppSocket: WASocket,
  logger: Logger,
): Promise<void> => {
  if (event.type === 'notify') {
    logger.info('New message received', JSON.stringify(event, undefined, 2));
    for (const msg of event.messages) {
      if (
        msg.key.remoteJid.includes('@g.us') &&
        msg.message?.extendedTextMessage?.text === '@573052625056 /tag all' &&
        msg.key.participant.includes('573163545096')
      ) {
        const metadata = await wppSocket.groupMetadata(msg.key.remoteJid);

        const participants = metadata.participants;

        await wppSocket.sendMessage(msg.key.remoteJid, {
          text: `Los que no se reporten @573244972472 le manda fotopolla`,
          mentions: participants.map((p) => p.id),
        });
      }
    }
  }
};
