import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoriesItemComponent } from './stories-item/stories-item.component';
import { StoriesComponent } from './stories/stories.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: StoriesComponent,
        data: {
          storyPage: false
        }
      },
      {
        path: ':sport/:date/:title/:id',
        component: StoriesItemComponent,
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
export class StoriesPageRoutingModule { }
