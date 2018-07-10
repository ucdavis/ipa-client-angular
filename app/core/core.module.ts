import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './auth/auth.service';

@NgModule({
	// Injected modules
  imports: [
    BrowserModule,
    HttpClientModule
	],
	// Injected components and directives
	declarations: [],
	// Injected services
	providers: [AuthService]
})

export class CoreModule {}
