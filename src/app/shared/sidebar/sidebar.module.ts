import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import {UserboxComponent} from "../signin/userbox/userbox.component";
import {SigninModule} from "../signin/signin.module";
import {LanguageComponent} from "../language/language.component";
import {LanguageModule} from "../language/language.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [ RouterModule, CommonModule, TranslateModule, SigninModule, LanguageModule ],
    declarations: [ SidebarComponent ],
    exports: [ SidebarComponent ],
    entryComponents: [ UserboxComponent, LanguageComponent]
})

export class SidebarModule {}
