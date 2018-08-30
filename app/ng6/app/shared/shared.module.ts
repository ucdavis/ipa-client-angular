import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppMaterialModule } from './app-material.module';

@NgModule({
  imports: [
    // import order matters
    CommonModule,

    // Angular extensions
    FormsModule,
    ReactiveFormsModule,

    // Custom modules
    AppMaterialModule
  ],
  declarations: [
    // components
    // none

    // directives
    // none

    // pipes
    // none
  ],
  exports: [
    // components
    // none

    // directives
    // none

    // pipes
    // none

    // modules
    CommonModule,
    RouterModule,

    // Angular extensions
    FormsModule,
    ReactiveFormsModule,

    // Third-party modules
    // none

    // Custom modules
    AppMaterialModule
  ],
  entryComponents: [ ]
})
export class SharedModule { }
