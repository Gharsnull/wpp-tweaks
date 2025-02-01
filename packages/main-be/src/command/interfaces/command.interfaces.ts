import { WAMessage, WAMessageContent } from '@whiskeysockets/baileys';
import { GroupCommandOverride } from '../../group-configuration/models/group-configuration.model';
import { ClientHandler } from '../../whatsapp-client/classes/client-handler';

export interface CommandPayload {
  groupJid: string;
  senderJid: string;
  args: string[];
  client: ClientHandler;
  WaMessage: WAMessage;
  messageType: keyof WAMessageContent;
  messageContent: WAMessageContent;
  commandConfiguration?: GroupCommandOverride;
}

export interface CommandHandler {
  handle(payload: CommandPayload): void;
}