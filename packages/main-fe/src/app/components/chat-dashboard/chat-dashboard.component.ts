import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatService } from '../../domain/chat/chat.service';
import { ChatListComponent } from "../chat-list/chat-list.component";
import { SearchInputComponent } from "../search-input/search-input.component";

@Component({
  selector: 'app-chat-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    A11yModule,
    SearchInputComponent,
    ChatListComponent
],
  templateUrl: './chat-dashboard.component.html',
  styleUrl: './chat-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatDashboardComponent implements OnInit {
  private readonly _chatService = inject(ChatService);

  ngOnInit(): void {
    this._chatService.loadChats();
  }
}
