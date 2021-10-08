import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyComponent } from './policy/policy.component';
import { Routes, RouterModule } from '@angular/router';
import { MenuModule } from '../shared/menu/menu.module';
import { MaterialModule } from '../material.module';
import {TranslateModule} from "@ngx-translate/core";

const policyRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PolicyComponent
      },
      {
        path: ':policySubId',
        component: PolicyComponent
      }
    ]
  }
];

@NgModule({
  declarations: [PolicyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(policyRoutes),
    MenuModule,
    MaterialModule,
    TranslateModule
  ]
})
export class PolicyPageModule { }
