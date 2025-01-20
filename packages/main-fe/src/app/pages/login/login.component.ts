import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SocketService } from '../../domain/socket/socket.service';
import { SOCKET_EVENTS } from '../../domain/socket/socket.constants';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    QRCodeModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  qrCode = signal('');
  private readonly _socketService = inject(SocketService);

  constructor() {
  }

  ngOnInit() {
    this._socketService._socket.on(SOCKET_EVENTS.QR_GENERATED, (qr: string) => {
      this.qrCode.set(qr);
    })
  }

  test() {
    this._socketService._socket.emit(SOCKET_EVENTS.START_SESSION, localStorage.getItem('connectionId'));
  }
}
