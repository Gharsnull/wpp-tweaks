import { ChangeDetectionStrategy, Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputComponent {
  searchFocused = signal(false);

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchField') searchField!: ElementRef;
  @ViewChild('searchToggleIcon') searchToggleIcon!: ElementRef;

  updateFocus(input: HTMLInputElement) {
    this.searchFocused.update((value) => !value);
    
    if(this.searchFocused()) {
      input.focus();
      return;
    }
    input.blur();
  }

}
