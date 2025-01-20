import { WAMessage } from '@whiskeysockets/baileys';
import { ClientHandler } from '../../whatsapp-client/classes/client-handler';

export interface CommandPayload {
  groupJid: string;
  senderJid: string;
  args: string[];
  client: ClientHandler;
  WaMessage: WAMessage;
}