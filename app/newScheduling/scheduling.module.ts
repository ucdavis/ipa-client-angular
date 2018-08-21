import { AppComponent } from '@scheduling/components/app/app.component';
import { MainComponent } from '@scheduling/components/main/main.component';
import { ScheduleSummaryComponent } from '@scheduling/components/schedule-summary/schedule-summary.component';

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
import { CourseResolver } from '@core/resolvers/course-resolver.service';

// Angular Material Component imports
import {
  MatButtonModule,
  MatTooltipModule,
  MatSortModule,
  MatInputModule
} from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
//import { SharedStateResolver } from '@core/shared-state/shared-state.resolver';

const appRoutes: Routes = [
  {
    path: 'newScheduling/:workgroupId/:year/:termCode',
    component: MainComponent,
    canActivate: [AuthGuard],
    resolve: {
      sectionGroups: SectionGroupResolver,
      courses: CourseResolver
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
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatInputModule
  ],
  declarations: [AppComponent, MainComponent, ScheduleSummaryComponent],
  providers: [SchedulingActions, AuthGuard, SectionGroupResolver, CourseResolver],
  bootstrap: [AppComponent]
})
export class AppModule {}
