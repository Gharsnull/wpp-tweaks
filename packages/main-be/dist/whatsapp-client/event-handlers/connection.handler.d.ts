import { ConnectionState } from '@whiskeysockets/baileys';
import { Logger } from 'pino';
import { Socket } from 'socket.io';
export declare const handleConntectionStateChange: (updateEvent: Partial<ConnectionState>, connectFn: () => void, connectedClient: Socket, uid: string, logger: Logger) => void;
