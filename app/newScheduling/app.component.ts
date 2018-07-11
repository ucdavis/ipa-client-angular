import { Component } from '@angular/core';
import { AuthService } from '@app/core';
import { ApiService } from '@app/core';

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html'
})
export class AppComponent {
  name: String = 'Taco taco taco';
  url: String = "/api/workgroups/" + 20 + "/years/" + 2018 + "/courses";

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  validateToken() {
    const jwt = localStorage.getItem('JWT');
    this.authService.validateToken(jwt);

    this.apiService.getCourses(this.url);
  }
}
