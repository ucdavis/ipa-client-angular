import { Component } from '@angular/core';

@Component({
  selector: 'ipa-nav',
  templateUrl: './ipa-nav.component.html',
  styleUrls: ['./ipa-nav.component.css']
})
export class IpaNav {
  isNavExpanded: boolean = true;
  activePage: string = 'schedule';

  constructor() {}

  toggleSideNav() {
    this.isNavExpanded = !this.isNavExpanded;
  }
}
