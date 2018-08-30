// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// Core
import { AuthGuard } from '@core/auth/auth-guard.service';
import { ApiService } from '@core/api/api.service';
import { CoreModule } from '@core/core.module';
import { UrlParameterResolver } from '@core/resolvers/param-resolver.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule // routing modules are always imported last
  ],
  declarations: [AppComponent],
  providers: [ApiService, AuthGuard, UrlParameterResolver],
  bootstrap: [AppComponent]
})
export class AppModule {}
