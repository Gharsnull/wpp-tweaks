import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardNavigationService } from '../../domain/dashboard-navigation/dashboard-navigation.service';
import { DASHBOARD } from '../../domain/dashboard-navigation/dashboard-navigation.constants';
import { ChatDashboardComponent } from "../chat-dashboard/chat-dashboard.component";
import { StatusDashboardComponent } from "../status-dashboard/status-dashboard.component";
import { ChanelDashboardComponent } from "../chanel-dashboard/chanel-dashboard.component";
import { CommunityDashboardComponent } from "../community-dashboard/community-dashboard.component";

@Component({
  selector: 'app-dashboard-wrapper',
  standalone: true,
  imports: [
    ChatDashboardComponent,
    StatusDashboardComponent,
    ChanelDashboardComponent,
    CommunityDashboardComponent
  ],
  templateUrl: './dashboard-wrapper.component.html',
  styleUrl: './dashboard-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardWrapperComponent {
  dashboards = DASHBOARD;

  currentDashboard = this._dashboardNavigationService.currentDashboard;


  constructor(
    private readonly _dashboardNavigationService: DashboardNavigationService
  ) {}

  test() {
    this._dashboardNavigationService.navigateTo(DASHBOARD.CHAT);
  }

}
