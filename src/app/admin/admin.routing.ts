import { Routes } from '@angular/router';

import { AdminComponent } from "./admin.component";
// import { Section2Component } from './section2/section2.component';


export const AdminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'social-pages',
        pathMatch: 'full'
      },
      {
        path: 'news',
        // component: SocialPagesComponent
        loadChildren: () => import('./news/news.module').then(m => m.NewsModule)
      },
      {
        path: 'social-pages',
        // component: SocialPagesComponent
        loadChildren: () => import('./social/pages/social-page.module').then(m => m.SocialPageModule)
      },
      {
        path: 'translations',
        // component: TranslationsComponent
        loadChildren: () => import('./translations/translations.module').then(m => m.TranslationsModule)
      },
      {
        path: 'manifestations',
        // component: ManifestationsComponent
        loadChildren: () => import('./registry/manifestations/manifestations.module').then(m => m.ManifestationsModule)
      },
      {
        path: 'competitions',
        // component: CompetitionsComponent
        loadChildren: () => import('./registry/competitions/competitions.module').then(m => m.CompetitionsModule)
      },
      {
        path: 'tournaments',
        // component: TournamentsComponent
        loadChildren: () => import('./registry/tournaments/tournaments.module').then(m => m.TournamentsModule)
      },
      {
        path: 'editions',
        // component: EditionsComponent
        loadChildren: () => import('./registry/editions/editions.module').then(m => m.EditionsModule)
      },
      {
        path: 'tags',
        // component: TagsComponent
        loadChildren: () => import('./tags/tags.module').then(m => m.TagsModule)
      },
      {
        path: 'medias',
        // component: MediasComponent
        loadChildren: () => import('./registry/medias/medias.module').then(m => m.MediasModule)
      },
      {
        path: 'teams',
        // component: TeamsComponent
        loadChildren: () => import('./registry/teams/teams.module').then(m => m.TeamsModule)
      },
      {
        path: 'athletes',
        // component: AthletesComponent
        loadChildren: () => import('./registry/athletes/athletes.module').then(m => m.AthletesModule)
      }
    ]
  }
];
