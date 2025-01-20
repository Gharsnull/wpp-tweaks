import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SocketService } from '../../domain/socket/socket.service';
import { map } from 'rxjs';
import { AuthService } from '../../domain/auth/auth.service';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const socketService = inject(AuthService);
  const router = inject(Router);

  return socketService.authState$.pipe(
    map((isAuthenticated) => isAuthenticated ? true : router.createUrlTree(['/login']))
  );
};
