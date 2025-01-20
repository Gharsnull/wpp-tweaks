import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDashboardComponent } from './status-dashboard.component';

describe('StatusDashboardComponent', () => {
  let component: StatusDashboardComponent;
  let fixture: ComponentFixture<StatusDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
