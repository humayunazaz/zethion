import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { NotFoundComponent } from './error/notfound/notfound.component';
import { WaitingconfirmComponent } from './layouts/waitingconfirm/waitingconfirm.component';
import { WaitingchangepasswordComponent } from './layouts/waitingchangepassword/waitingchangepassword.component';

import { OnfieldTestComponent } from './results/result-details/details-football/onfield-test/onfield-test.component';
import { LoginGuardService } from "./shared/_service/signin/login-guard.service";
import { MenubarComponent } from "./shared/menubar/menubar.component";

export const AppRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./stories-page/stories-page.module').then(m => m.StoriesPageModule)
      },
      {
        path: 'news',
        loadChildren: () => import('./news/news.module').then(m => m.NewsModule)
      },
      // {
      //   path: 'news',
      //   loadChildren: () => import('./news/news.module').then(m => m.NewsModule)
      // },
      {
        path: 'info',
        loadChildren: () => import('./policy-page/policy-page.module').then(m => m.PolicyPageModule)
      },
      {
        path: 'stories',
        loadChildren: () => import('./stories-page/stories-page.module').then(m => m.StoriesPageModule)
      },
      {
        path: 'curiosities',
        loadChildren: () => import('./curiosities-page/curiosities-page.module').then(m => m.CuriositiesPageModule)
      },
      {
        path: 'match',
        loadChildren: () => import('./match/match.module').then(m => m.MatchModule)
      },
      // {
      //   path: 'results',
      //   loadChildren: () => import('./results/results.module').then(m => m.ResultsModule)
      // },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [LoginGuardService]
      },
      {
        path: 'onfield-test',
        component: OnfieldTestComponent
      }
    ]
  },
  {
    path: 'signin',
    component: MenubarComponent,
  },
  // {
  //   path: 'confirm',
  //   component: WaitingconfirmComponent,
  // },
  // {
  //   path: 'change_password',
  //   component: WaitingchangepasswordComponent,
  // },
  // error redirect
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];
