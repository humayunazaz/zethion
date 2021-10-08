import {NgModule} from "@angular/core";
import {LanguageComponent} from "./language.component";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import { MaterialModule } from "../../material.module";


@NgModule({
  declarations: [LanguageComponent],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MaterialModule
  ],
  exports: [LanguageComponent]

})
export class LanguageModule { }
