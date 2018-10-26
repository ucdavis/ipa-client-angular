import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material.module';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminMainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    AdminModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
