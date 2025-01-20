import { BaileysEventMap } from '@whiskeysockets/baileys';
import { ClientHandler } from '../classes/client-handler';

export interface WhatsappEventPayload<
  K extends keyof BaileysEventMap = keyof BaileysEventMap,
> {
  event: BaileysEventMap[K]; // The event data from BaileysEventMap
  handler: ClientHandler; // Reference to the handler
}
