import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    console.log("[DEBUG] app");
//    this.router.navigate(['newScheduling/18/2018']);
  }
}
