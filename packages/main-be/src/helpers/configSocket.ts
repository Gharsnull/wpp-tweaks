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

export default function configSocket(
  state: AuthenticationState,
  version: WAVersion,
): UserFacingSocketConfig {
  return {
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'info' })),
    },
    version,
    defaultQueryTimeoutMs: undefined,
    syncFullHistory: false,
    logger: pino({ level: 'info' }),
    shouldIgnoreJid: (jid) =>
      isJidBroadcast(jid) || isJidNewsletter(jid) || isJidStatusBroadcast(jid),
  };
}
