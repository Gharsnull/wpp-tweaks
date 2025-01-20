import { inject, Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { SOCKET_EVENTS } from '../socket/socket.constants';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly _socketService = inject(SocketService);

  constructor() {
  }

  loadChats() {
    this._socketService._socket.emit(SOCKET_EVENTS.LOAD_CHATS);
  }
}
