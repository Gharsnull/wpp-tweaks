import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanelDashboardComponent } from './chanel-dashboard.component';

describe('ChanelDashboardComponent', () => {
  let component: ChanelDashboardComponent;
  let fixture: ComponentFixture<ChanelDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChanelDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChanelDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
