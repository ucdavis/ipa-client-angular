import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AdminMainComponent } from './admin-main/admin-main.component';

@NgModule({
  declarations: [],
  imports: [
    SharedModule
  ],
  providers: [
    AdminMainComponent
  ]
})
export class AdminModule { }
