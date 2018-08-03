import { AppComponent } from '@scheduling/components/app/app.component';
import { MainComponent } from '@scheduling/components/main/main.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';


import { SchedulingActions } from '@scheduling/scheduling-actions.service';

// Core imports
import { CoreModule } from '@core/core.module';
import { AuthGuard } from '@core/auth/auth-guard.service';
import { RedirectGuard } from '@core/api/redirect-guard.service';

import { SectionGroupResolver } from '@core/resolvers/section-group-resolver.service';

// Angular Material Component imports

import { MatButtonModule, MatTooltipModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
//import { SharedStateResolver } from '@core/shared-state/shared-state.resolver';

const appRoutes: Routes = [
  {
    path: 'newScheduling/:workgroupId/:year/:termCode',
    component: MainComponent,
    canActivate: [AuthGuard],
    resolve: {
      sectionGroups: SectionGroupResolver
    }
  },
  {
    path: '**',
    component: AppComponent,
    canActivate: [RedirectGuard]
  }
];

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserAnimationsModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    FormsModule
  ],
  declarations: [AppComponent, MainComponent],
  providers: [SchedulingActions, AuthGuard, SectionGroupResolver],
  bootstrap: [AppComponent]
})
export class AppModule {}
