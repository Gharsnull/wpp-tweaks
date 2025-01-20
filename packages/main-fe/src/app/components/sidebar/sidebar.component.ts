import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardNavigationService } from '../../domain/dashboard-navigation/dashboard-navigation.service';
import { DASHBOARD } from '../../domain/dashboard-navigation/dashboard-navigation.constants';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  dashboards = DASHBOARD;

  currentDashboard = this._dashboardNavigationService.currentDashboard;

  constructor(
    private readonly _dashboardNavigationService: DashboardNavigationService
  ) {}

  updateCurrentDashboard(dashboard: DASHBOARD): void {
    this._dashboardNavigationService.navigateTo(dashboard);
  }
}
