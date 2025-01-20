import { Routes } from "@angular/router";
import { PageWrapperComponent } from "./page-wrapper/page-wrapper.component";
import { MainComponent } from "./main/main.component";
import { LoginComponent } from "./login/login.component";
import { authenticatedGuard } from "../guards/authenticated/authenticated.guard";
import { nonAuthenticatedGuard } from "../guards/nonAuthenticated/non-authenticated.guard";

export const pageRoutes: Routes = [
  {
    path: '',
    component:PageWrapperComponent,
    children: [
      {
        path: '',
        component: MainComponent,
        canActivate: [authenticatedGuard]
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [nonAuthenticatedGuard]
      }
    ]
  }
];