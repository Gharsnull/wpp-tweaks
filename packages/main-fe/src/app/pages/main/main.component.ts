import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { ChatComponent } from "../../components/chat/chat.component";
import { DashboardNavigationService } from '../../domain/dashboard-navigation/dashboard-navigation.service';
import { DashboardWrapperComponent } from '../../components/dashboard-wrapper/dashboard-wrapper.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SidebarComponent, ChatComponent, DashboardWrapperComponent],
  providers: [DashboardNavigationService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

}
