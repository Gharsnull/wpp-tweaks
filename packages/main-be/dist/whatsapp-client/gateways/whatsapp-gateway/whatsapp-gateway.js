"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const client_handler_1 = require("../../classes/client-handler");
const socket_io_1 = require("socket.io");
const crypto_1 = require("crypto");
let WhatsappGateway = class WhatsappGateway {
    async handleStartSession(clientId, client) {
        let sessionID = clientId;
        if (!sessionID) {
            sessionID = (0, crypto_1.randomUUID)();
        }
        new client_handler_1.ClientHandler(sessionID, client).createConnection();
        return;
    }
};
exports.WhatsappGateway = WhatsappGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('start-session'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WhatsappGateway.prototype, "handleStartSession", null);
exports.WhatsappGateway = WhatsappGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'whatsapp',
        cors: true,
        origins: 'http://localhost:4200',
    })
], WhatsappGateway);
//# sourceMappingURL=whatsapp-gateway.js.map