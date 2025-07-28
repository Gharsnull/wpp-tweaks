import {
  UserFacingSocketConfig,
  Browsers,
  BaileysEventMap,
  GroupMetadata,
} from '@whiskeysockets/baileys';
import P from 'pino';
import NodeCache from '@cacheable/node-cache'
import whatsappConfig from '../../config/whatsapp.config';

const _groupCache = new NodeCache<GroupMetadata>();

export const waLogger = P(
  {
    timestamp: () => `,"time":"${new Date().toJSON()}"`,
    level: 'silent',
  },
  P.destination(whatsappConfig.loggerPath),
);

export const WaClientConfig: Partial<UserFacingSocketConfig> = {
  connectTimeoutMs: 60 * 1000,
  qrTimeout: 120 * 1000,
  markOnlineOnConnect: true,
  browser: Browsers.macOS('Desktop'),
  cachedGroupMetadata: async(jid) => _groupCache.get(jid),
  generateHighQualityLinkPreview: true,
  logger: waLogger,
  syncFullHistory: false
};

// Use `keyof` to extract the keys from the BaileysEventMap type
export type BaileysEventMapKeys = keyof BaileysEventMap;

// Create a const object to simulate an enum dynamically
export enum WhatsappEvents {
  CONNECTION_UPDATE = 'connection.update',
  MESSAGES_UPSERT = 'messages.upsert',
  GROUPS_UPSERT = 'groups.upsert',
  GROUP_PARTICIPANTS_UPDATE = 'group-participants.update',
}
