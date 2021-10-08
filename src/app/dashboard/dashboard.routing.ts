import { SearchComponent } from './search/search.component';
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { CustomizeComponent } from './customize/customize.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: 'news',
      //   component: NewsSectionComponent,
      // },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'reset_password',
        component: ResetPasswordComponent,
      },
      {
        path: 'customize',
        component: CustomizeComponent,
      },
    ]
  }
];
