import { Routes } from '@angular/router';
import { authenticatedGuard } from './guards/authenticated/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/pages.routes').then(m => m.pageRoutes),
  }
];
