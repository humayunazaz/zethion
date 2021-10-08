import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class IconModule {

  constructor(private library: FaIconLibrary) {
    library.addIconPacks(fas);
  }

}
