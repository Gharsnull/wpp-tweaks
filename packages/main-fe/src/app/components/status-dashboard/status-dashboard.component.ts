import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-status-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './status-dashboard.component.html',
  styleUrl: './status-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusDashboardComponent {

}
