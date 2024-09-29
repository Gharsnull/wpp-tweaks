"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientHandler = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const NodeCache = require("node-cache");
const pino_1 = require("pino");
const readline_1 = require("readline");
const whatsapp_config_1 = require("../../config/whatsapp.config");
const event_handlers_1 = require("../event-handlers");
const history_handler_1 = require("../event-handlers/history.handler");
class ClientHandler {
    constructor(uid, connectedClient) {
        this._logger = (0, pino_1.default)({
            timestamp: () => `,"time":"${new Date().toJSON()}"`,
            level: 'trace',
        }, pino_1.default.destination('./wa-logs.txt'));
        this._doReplies = whatsapp_config_1.default.doReplies;
        this._usePairingCode = whatsapp_config_1.default.usePairingCode;
        this._useStore = whatsapp_config_1.default.useStore;
        this._msgRetryCounterCachce = new NodeCache();
        this._onDemandMap = new Map();
        this._readLine = (0, readline_1.createInterface)({
            input: process.stdin,
            output: process.stdout,
        });
        this._store = this._useStore
            ? (0, baileys_1.makeInMemoryStore)({ logger: this._logger })
            : undefined;
        this._uid = uid;
        this._connectedClient = connectedClient;
        this._store?.readFromFile('./baileys_this.__multi.json');
        setInterval(() => {
            this._store?.writeToFile('./baileys_store_multi.json');
        }, 10_000);
    }
    async createConnection() {
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(`baileys_auth_info/${this._uid}`);
        const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
        this._logger.info(`Using WA v${version.join('.')} (latest: ${isLatest})`);
        this._wppSocket = (0, baileys_1.default)({
            logger: this._logger,
            connectTimeoutMs: 60 * 1000,
            qrTimeout: 60 * 1000,
            syncFullHistory: false,
            markOnlineOnConnect: true,
            msgRetryCounterCache: this._msgRetryCounterCachce,
            browser: baileys_1.Browsers.macOS('Desktop'),
            version: version,
            auth: {
                creds: state.creds,
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, this._logger),
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
        const sendMessageWTyping = async (msg, jid) => {
            await this._wppSocket.presenceSubscribe(jid);
            await (0, baileys_1.delay)(500);
            await this._wppSocket.sendPresenceUpdate('composing', jid);
            await (0, baileys_1.delay)(2000);
            await this._wppSocket.sendPresenceUpdate('paused', jid);
            await this._wppSocket.sendMessage(jid, msg);
        };
        this._wppSocket.ev.on('connection.update', (event) => (0, event_handlers_1.handleConntectionStateChange)(event, this.createConnection.bind(this), this._connectedClient, this._uid, this._logger));
        this._wppSocket.ev.on('messages.upsert', (event) => (0, event_handlers_1.handleMessageEvent)(event, this._wppSocket, this._logger));
        this._wppSocket.ev.on('messaging-history.set', (event) => (0, history_handler_1.handleHistoryEvent)(event, this._connectedClient));
        this._wppSocket.ev.process(async (events) => {
            if (events['creds.update']) {
                await saveCreds();
            }
        });
        return this._wppSocket;
    }
    _question(text) {
        return new Promise((resolve) => this._readLine.question(text, resolve));
    }
    async _getMessage(key) {
        if (this._store) {
            const msg = await this._store.loadMessage(key.remoteJid, key.id);
            return msg?.message || undefined;
        }
        return baileys_1.proto.Message.fromObject({});
    }
}
exports.ClientHandler = ClientHandler;
//# sourceMappingURL=client-handler.js.map