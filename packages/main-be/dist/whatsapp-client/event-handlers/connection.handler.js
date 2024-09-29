"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConntectionStateChange = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const handleConntectionStateChange = (updateEvent, connectFn, connectedClient, uid, logger) => {
    const { connection, lastDisconnect, qr } = updateEvent;
    const disconnectionError = lastDisconnect?.error;
    if (qr) {
        logger.info('QR code received');
        connectedClient.emit('qr', qr);
        return;
    }
    if (connection === 'close') {
        if (disconnectionError?.output?.statusCode !== baileys_1.DisconnectReason.loggedOut &&
            disconnectionError?.output?.statusCode !==
                baileys_1.DisconnectReason.connectionReplaced) {
            logger.info('Reconnecting');
            connectFn();
            return;
        }
        if (disconnectionError?.output?.statusCode === baileys_1.DisconnectReason.loggedOut) {
            logger.info('Logged out');
            connectedClient.emit('logged-out');
            return;
        }
    }
    if (connection === 'open') {
        connectedClient.emit('connection-id', uid);
        console.log('Connected');
    }
};
exports.handleConntectionStateChange = handleConntectionStateChange;
//# sourceMappingURL=connection.handler.js.map