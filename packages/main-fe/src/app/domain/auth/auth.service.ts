import { inject, Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SOCKET_EVENTS } from '../socket/socket.constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _socketService = inject(SocketService);
  private readonly _router = inject(Router);

  authState$ = new BehaviorSubject<boolean>(false);

  constructor() { 
    this._socketService._socket.on(SOCKET_EVENTS.CONNECTION_ID, (connectionId: string) => {
      localStorage.setItem('connectionId', connectionId);
      this.authState$.next(true);
      this._router.navigate(['']);
    })

    this._socketService._socket.on(SOCKET_EVENTS.LOGGED_OUT, () => {
      localStorage.removeItem('connectionId');
      this.authState$.next(false);
      this._router.navigate(['login']);
    });
  }
}
