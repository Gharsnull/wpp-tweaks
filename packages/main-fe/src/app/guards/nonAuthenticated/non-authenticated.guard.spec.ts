import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { nonAuthenticatedGuard } from './non-authenticated.guard';

describe('nonAuthenticatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => nonAuthenticatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
