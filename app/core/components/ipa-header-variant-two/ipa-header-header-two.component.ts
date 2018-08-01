import { Component } from '@angular/core';

@Component({
  selector: 'ipa-header-variant-two',
  templateUrl: './ipa-header-variant-two.component.html',
  styleUrls: ['./ipa-header-variant-two.component.css']
})
export class IpaHeader {
  selectedWorkgroup = 'dss_it';

  constructor() {}
}
