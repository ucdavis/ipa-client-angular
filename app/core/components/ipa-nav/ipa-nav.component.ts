import { Component } from '@angular/core';

@Component({
  selector: 'ipa-nav',
  templateUrl: './ipa-nav.component.html',
  styleUrls: ['./ipa-nav.component.css']
})
export class IpaNav {
  isNavExpanded: boolean = false;
  activeAccordion: string = "";
  activePage: string = "";
  summary: any;
  instructor: any;
  taAndReader: any;
  report: any;

  constructor() {}

  toggleSideNav () {
    this.isNavExpanded = !this.isNavExpanded;
  }
}
