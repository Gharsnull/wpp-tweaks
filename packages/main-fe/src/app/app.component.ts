import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SocketService } from './domain/socket/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'main-fe';

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconInNamespace(
      "wpp",
      "chat-dashboard",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/chat-dashboard.svg")
    );

    iconRegistry.addSvgIconInNamespace(
      "wpp",
      "status-dashboard",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/status-dashboard.svg")
    );

    iconRegistry.addSvgIconInNamespace(
      "wpp",
      "channels-dashboard",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/channels-dashboard.svg")
    );

    iconRegistry.addSvgIconInNamespace(
      "wpp",
      "communities-dashboard",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/communities-dashboard.svg")
    );

    iconRegistry.addSvgIconInNamespace(
      "wpp",
      "settings",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/settings.svg")
    );

    iconRegistry.addSvgIconInNamespace(
      "wpp",
      "new-chat",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/new-chat.svg")
    );

    iconRegistry.addSvgIconInNamespace(
      "wpp",
      "menu",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/menu.svg")
    );

    iconRegistry.addSvgIconInNamespace(
      "wpp",
      "search",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/search.svg")
    );

    iconRegistry.addSvgIconInNamespace(
      "wpp",
      "left-arrow",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/left-arrow.svg")
    );
  }
}
