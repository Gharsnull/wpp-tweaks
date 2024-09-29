import { Chat, Contact, WAMessage, proto } from '@whiskeysockets/baileys';
import { Socket } from 'socket.io';
export interface HistoryEvent {
    chats: Chat[];
    contacts: Contact[];
    messages: WAMessage[];
    isLatest?: boolean;
    progress?: number | null;
    syncType?: proto.HistorySync.HistorySyncType;
}
export declare const handleHistoryEvent: (event: HistoryEvent, connectedClient: Socket) => void;
