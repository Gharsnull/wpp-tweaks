import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CHAT_FILTERS } from './chat-list.constants';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    FormsModule,
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListComponent {
  filterOptions = CHAT_FILTERS;

  selectedFilter = signal(this.filterOptions.ALL);
  chats:any[] = [];
}
