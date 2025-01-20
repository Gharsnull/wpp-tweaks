import { Injectable, signal } from '@angular/core';
import { DASHBOARD } from './dashboard-navigation.constants';

@Injectable()
export class DashboardNavigationService {
  private readonly _currentDashboard = signal<DASHBOARD>(DASHBOARD.CHAT);
  currentDashboard = this._currentDashboard.asReadonly();

  constructor() { }

  navigateTo(dashboard: DASHBOARD): void {
    this._currentDashboard.set(dashboard);
  }
}
