import { TestBed } from '@angular/core/testing';

import { DashboardNavigationService } from './dashboard-navigation.service';

describe('DashboardNavigationService', () => {
  let service: DashboardNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
