import { AppComponent } from './components/app/app.component';
import { MainComponent } from './components/main/main.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes }  from '@angular/router';

import { CoreModule } from '@core/core.module';

// ngrx store
import { StoreModule } from '@ngrx/store';
import { schedulingReducer } from './reducers/scheduling.reducers';
import { SchedulingActions } from '@scheduling/scheduling-actions.service';

import { AuthGuard } from '@core/auth/auth-guard.service';
import { SectionGroupResolver } from '@core/resolvers/section-group-resolver.service';
import { UrlGenerationResolver } from '@core/resolvers/url-generation-resolver.service';

const appRoutes: Routes = [
  {
    path: 'newScheduling/:workgroupId/:year',
    component: MainComponent,
    canActivate: [AuthGuard],
    resolve: {
      sectionGroups: SectionGroupResolver
    }
  },
  {
    path: '**',
    component: AppComponent,
    resolve: {
      validate: UrlGenerationResolver
    }
  }
];

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    StoreModule.forRoot({
      scheduling: schedulingReducer,
    }),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  declarations: [AppComponent, MainComponent],
  providers: [SchedulingActions, AuthGuard, SectionGroupResolver, UrlGenerationResolver],
  bootstrap: [AppComponent]
})
export class AppModule {}
