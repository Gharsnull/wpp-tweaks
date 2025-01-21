import { EventEmitter2 } from '@nestjs/event-emitter';
import makeWASocket, {
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  WASocket
} from '@whiskeysockets/baileys';
import {
  WaClientConfig,
  waLogger,
} from '../constants/whatsapp-client.constants';
import whatsappConfig from '../../config/whatsapp.config';

export class ClientHandler {
  private readonly _logger = waLogger;

  _wppSocket: WASocket;

  constructor(private readonly eventEmitter: EventEmitter2) { }

  async createConnection() {
    const { state, saveCreds } = await useMultiFileAuthState(whatsappConfig.authPath);
    const { version, isLatest } = await fetchLatestBaileysVersion();

    this._logger.info(`Using WA v${version.join('.')} (latest: ${isLatest})`);

    this._wppSocket = makeWASocket({
      ...WaClientConfig,
      version: version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, this._logger),
      },
    });

    this._wppSocket.ev.process((events) => {
      if (!!events && Object.keys(events).length > 0) {
        Object.keys(events).forEach((key) => {
          this.eventEmitter.emit(key, { event: events[key], handler: this });
        });
      }
    });

    this._wppSocket.ev.on('creds.update', async () => {
      await saveCreds();
    });

    return this._wppSocket;
  }
}
