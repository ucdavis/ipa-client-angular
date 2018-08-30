import '@core/styles.css';

import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isNavExpanded = true;
  activePage: string;

  constructor() {}

  toggleSideNav() {
    this.isNavExpanded = !this.isNavExpanded;
  }
}
