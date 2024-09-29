import makeWASocket, {
  AnyMessageContent,
  Browsers,
  delay,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  proto,
  useMultiFileAuthState,
  WAMessageContent,
  WAMessageKey,
  WASocket,
} from '@whiskeysockets/baileys';
import * as NodeCache from 'node-cache';
import P from 'pino';
import { createInterface } from 'readline';
import whatsappConfig from '../../config/whatsapp.config';
import {
  handleConntectionStateChange,
  handleMessageEvent,
} from '../event-handlers';
import { Socket } from 'socket.io';
import { handleHistoryEvent } from '../event-handlers/history.handler';

export class ClientHandler {
  private readonly _logger = P(
    {
      timestamp: () => `,"time":"${new Date().toJSON()}"`,
      level: 'trace',
    },
    P.destination('./wa-logs.txt'),
  );
  private readonly _doReplies = whatsappConfig.doReplies;
  private readonly _usePairingCode = whatsappConfig.usePairingCode;
  private readonly _useStore = whatsappConfig.useStore;

  //TODO: implement
  private readonly _msgRetryCounterCachce = new NodeCache();

  private readonly _onDemandMap = new Map<string, string>();

  private readonly _readLine = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  private readonly _store = this._useStore
    ? makeInMemoryStore({ logger: this._logger })
    : undefined;

  private _wppSocket: WASocket;
  private readonly _uid: string;
  private readonly _connectedClient: Socket;

  constructor(uid: string, connectedClient: Socket) {
    this._uid = uid;
    this._connectedClient = connectedClient;
    this._store?.readFromFile('./baileys_this.__multi.json');
    // save every 10s
    setInterval(() => {
      this._store?.writeToFile('./baileys_store_multi.json');
    }, 10_000);

    // connectedClient.on('load-chats', async () => {
    //   const chats = await this._wppSocket.fetchMessageHistory(
    //     100,
    //     'chat',
    //     'all',
    //   );

    //   connectedClient.emit('chats-loaded', chats);
    // });
  }

  async createConnection() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { state, saveCreds } = await useMultiFileAuthState(
      `baileys_auth_info/${this._uid}`,
    );
    const { version, isLatest } = await fetchLatestBaileysVersion();

    this._logger.info(`Using WA v${version.join('.')} (latest: ${isLatest})`);

    this._wppSocket = makeWASocket({
      logger: this._logger,
      connectTimeoutMs: 60 * 1000,
      qrTimeout: 60 * 1000,
      syncFullHistory: false,
      markOnlineOnConnect: true,
      msgRetryCounterCache: this._msgRetryCounterCachce,
      browser: Browsers.macOS('Desktop'),
      version: version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, this._logger),
      },
      generateHighQualityLinkPreview: true,
      getMessage: this._getMessage,
    });

    if (this._store) {
      this._store.bind(this._wppSocket.ev);
    }

    if (this._usePairingCode && !this._wppSocket.authState.creds.registered) {
      const phoneNumber = await this._question('Enter your phone number: ');
      const code = await this._wppSocket.requestPairingCode(phoneNumber);
      this._logger.info('Pairing code:', code);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sendMessageWTyping = async (msg: AnyMessageContent, jid: string) => {
      await this._wppSocket.presenceSubscribe(jid);
      await delay(500);

      await this._wppSocket.sendPresenceUpdate('composing', jid);
      await delay(2000);

      await this._wppSocket.sendPresenceUpdate('paused', jid);

      await this._wppSocket.sendMessage(jid, msg);
    };

    this._wppSocket.ev.on('connection.update', (event) =>
      handleConntectionStateChange(
        event,
        this.createConnection.bind(this),
        this._connectedClient,
        this._uid,
        this._logger,
      ),
    );

    this._wppSocket.ev.on('messages.upsert', (event) =>
      handleMessageEvent(event, this._wppSocket, this._logger),
    );

    this._wppSocket.ev.on('messaging-history.set', (event) =>
      handleHistoryEvent(event, this._connectedClient),
    );

    // the process function lets you process all events that just occurred
    // efficiently in a batch
    this._wppSocket.ev.process(
      // events is a map for event name => event data
      async (events) => {
        // credentials updated -- save them
        if (events['creds.update']) {
          await saveCreds();
        }

        // if (events['labels.association']) {
        //   console.log(events['labels.association']);
        // }

        // if (events['labels.edit']) {
        //   console.log(events['labels.edit']);
        // }

        // if (events.call) {
        //   console.log('recv call event', events.call);
        // }

        // received a new message
        // if (events['messages.upsert']) {
        //   const upsert = events['messages.upsert'];
        //   console.log('recv messages ', JSON.stringify(upsert, undefined, 2));

        //   if (upsert.type === 'notify') {
        //     for (const msg of upsert.messages) {
        //       if (
        //         msg.key.remoteJid.includes('@g.us') &&
        //         msg.message?.extendedTextMessage?.text ===
        //           '@573052625056 /tag all'
        //       ) {
        //         const metadata = await this._wppSocket.groupMetadata(msg.key.remoteJid);

        //         const participants = metadata.participants;

        //         await this._wppSocket.sendMessage(msg.key.remoteJid, {
        //           text: `Los nuevos se presentan con un nude al privado de @573244972472`,
        //           mentions: participants.map((p) => p.id),
        //         });
        //       }
        //     }
        //   }
        // }

        // history received
        // if (events['messaging-history.set']) {
        //   const { chats, contacts, messages, isLatest, progress, syncType } =
        //     events['messaging-history.set'];
        //   if (syncType === proto.HistorySync.HistorySyncType.ON_DEMAND) {
        //     console.log('received on-demand history sync, messages=', messages);
        //   }
        //   console.log(
        //     `recv ${chats.length} chats, ${contacts.length} contacts, ${messages.length} msgs (is latest: ${isLatest}, progress: ${progress}%), type: ${syncType}`,
        //   );
        // }

        // // messages updated like status delivered, message deleted etc.
        // if (events['messages.update']) {
        //   console.log(JSON.stringify(events['messages.update'], undefined, 2));

        //   for (const { key, update } of events['messages.update']) {
        //     if (update.pollUpdates) {
        //       const pollCreation = await this._getMessage(key);
        //       if (pollCreation) {
        //         console.log(
        //           'got poll update, aggregation: ',
        //           getAggregateVotesInPollMessage({
        //             message: pollCreation,
        //             pollUpdates: update.pollUpdates,
        //           }),
        //         );
        //       }
        //     }
        //   }
        // }

        // if (events['message-receipt.update']) {
        //   console.log(events['message-receipt.update']);
        // }

        // if (events['messages.reaction']) {
        //   console.log(events['messages.reaction']);
        // }

        // if (events['presence.update']) {
        //   console.log(events['presence.update']);
        // }

        // if (events['chats.update']) {
        //   console.log(events['chats.update']);
        // }

        // if (events['contacts.update']) {
        //   for (const contact of events['contacts.update']) {
        //     if (typeof contact.imgUrl !== 'undefined') {
        //       const newUrl =
        //         contact.imgUrl === null
        //           ? null
        //           : await this._wppSocket!
        //               .profilePictureUrl(contact.id!)
        //               .catch(() => null);
        //       console.log(
        //         `contact ${contact.id} has a new profile pic: ${newUrl}`,
        //       );
        //     }
        //   }
        // }

        // if (events['chats.delete']) {
        //   console.log('chats deleted ', events['chats.delete']);
        // }
      },
    );

    return this._wppSocket;
  }

  private _question(text: string) {
    return new Promise<string>((resolve) =>
      this._readLine.question(text, resolve),
    );
  }

  private async _getMessage(
    key: WAMessageKey,
  ): Promise<WAMessageContent | undefined> {
    if (this._store) {
      const msg = await this._store.loadMessage(key.remoteJid!, key.id!);
      return msg?.message || undefined;
    }

    // only if store is present
    return proto.Message.fromObject({});
  }
}
