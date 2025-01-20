import {
  AuthenticationState,
  isJidBroadcast,
  isJidNewsletter,
  isJidStatusBroadcast,
  makeCacheableSignalKeyStore,
  UserFacingSocketConfig,
  WAVersion,
} from '@whiskeysockets/baileys';
import pino from 'pino';
import NodeCache from 'node-cache';

export default function configSocket(
  state: AuthenticationState,
  msgRetryCounterCache: NodeCache,
  version: WAVersion,
): UserFacingSocketConfig {
  return {
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'info' })),
    },
    version,
    msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
    syncFullHistory: false,
    logger: pino({ level: 'info' }),
    shouldIgnoreJid: (jid) =>
      isJidBroadcast(jid) || isJidNewsletter(jid) || isJidStatusBroadcast(jid),
  };
}
