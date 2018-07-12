import { AppComponent } from './components/app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from '@core/core.module';

// ngrx store
import { StoreModule } from '@ngrx/store';
import { schedulingReducer } from './reducers/scheduling.reducers';
import { SchedulingActions } from '@scheduling/scheduling-actions.service';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    StoreModule.forRoot({
      scheduling: schedulingReducer,
    })
  ],
  declarations: [AppComponent],
  providers: [SchedulingActions],
  bootstrap: [AppComponent]
})
export class AppModule {}
