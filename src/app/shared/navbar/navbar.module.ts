import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {DynamicComponent, NavbarComponent} from './navbar.component';
import { SigninModule } from "../signin/signin.module";
import {LanguageComponent} from "../language/language.component";
import {LanguageModule} from "../language/language.module";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
    imports: [ RouterModule, CommonModule, TranslateModule, MatButtonModule, SigninModule, LanguageModule ],
    declarations: [ NavbarComponent, DynamicComponent],
    exports: [ NavbarComponent, DynamicComponent],
    entryComponents: [DynamicComponent, LanguageComponent ],
})

export class NavbarModule {}
