import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditNewsComponent } from './add-edit-news/add-edit-news.component';
import { NewsComponent } from './news.component';

const routes: Routes = [
  {
    path: '',
    component: NewsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
