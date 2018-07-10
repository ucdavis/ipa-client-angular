import { Component } from '@angular/core';
import { AuthService } from './../core/auth/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html'
})
export class AppComponent {
  name: String = 'Taco taco taco';

  constructor(private authService: AuthService) {}

  validateToken() {
    const jwt = localStorage.getItem('JWT');
    this.authService.validateToken(jwt);
  }
}
