import { Socket } from 'socket.io';
export declare class WhatsappGateway {
    handleStartSession(clientId: string, client: Socket): Promise<void>;
}
