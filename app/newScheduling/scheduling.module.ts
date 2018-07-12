import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from './../core/core.module';

// ngrx store
import { StoreModule } from '@ngrx/store';
import { schedulingReducer } from './reducers/scheduling.reducers';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    StoreModule.forRoot({
      scheduling: schedulingReducer,
    })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
