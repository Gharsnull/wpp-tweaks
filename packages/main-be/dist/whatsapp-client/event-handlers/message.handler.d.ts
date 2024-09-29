import { WAMessage, MessageUpsertType, WASocket } from '@whiskeysockets/baileys';
import { Logger } from 'pino';
export interface MessageEvent {
    messages: WAMessage[];
    type: MessageUpsertType;
    requestId?: string;
}
export declare const handleMessageEvent: (event: MessageEvent, wppSocket: WASocket, logger: Logger) => Promise<void>;
