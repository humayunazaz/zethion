import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CuriositiesItemComponent } from './curiosities-item/curiosities-item.component';
import { CuriositiesComponent } from './curiosities/curiosities.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CuriositiesComponent,
      },
      {
        path: ':sport/:date/:title/:id',
        component: CuriositiesItemComponent,
        data: {
          storyPage: true
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuriositiesPageRoutingModule { }
