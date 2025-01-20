import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { io } from 'socket.io-client';
import { SOCKET_EVENTS } from './socket.constants';
import { BehaviorSubject, Observable, startWith } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly _url = `${environment.socket.url}/whatsapp`;
  readonly _socket = io(this._url);

  constructor() {
    this._socket.on(SOCKET_EVENTS.CONNECT, () => {
      this._socket.emit(SOCKET_EVENTS.START_SESSION, localStorage.getItem('connectionId'));
    });
  }
}
