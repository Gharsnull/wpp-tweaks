import {
  UserFacingSocketConfig,
  Browsers,
  BaileysEventMap,
} from '@whiskeysockets/baileys';
import * as NodeCache from 'node-cache';
import P from 'pino';

const _msgRetryCounterCachce = new NodeCache();

export const waLogger = P(
  {
    timestamp: () => `,"time":"${new Date().toJSON()}"`,
    level: 'trace',
  },
  P.destination('./wa-logs.txt'),
);

export const WaClientConfig: Partial<UserFacingSocketConfig> = {
  connectTimeoutMs: 60 * 1000,
  qrTimeout: 120 * 1000,
  markOnlineOnConnect: true,
  msgRetryCounterCache: _msgRetryCounterCachce,
  browser: Browsers.macOS('Desktop'),
  generateHighQualityLinkPreview: true,
  logger: waLogger,
  printQRInTerminal: true,
};

// Use `keyof` to extract the keys from the BaileysEventMap type
export type BaileysEventMapKeys = keyof BaileysEventMap;

// Create a const object to simulate an enum dynamically
export enum WhatsappEvents {
  CONNECTION_UPDATE = 'connection.update',
  MESSAGES_UPSERT = 'messages.upsert',
  GROUPS_UPSERT = 'groups.upsert',
}
