"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHistoryEvent = void 0;
const handleHistoryEvent = (event, connectedClient) => {
    const { chats } = event;
    connectedClient.emit('chats-loaded', chats);
};
exports.handleHistoryEvent = handleHistoryEvent;
//# sourceMappingURL=history.handler.js.map