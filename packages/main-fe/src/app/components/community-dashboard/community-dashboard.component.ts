import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-community-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './community-dashboard.component.html',
  styleUrl: './community-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityDashboardComponent {

}
