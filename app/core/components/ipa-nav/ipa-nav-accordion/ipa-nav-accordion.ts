import { Component, Input } from '@angular/core';
import { NavAccordion } from '@core/components/ipa-nav/nav-accordion.model';

@Component({
  selector: 'ipa-nav-accordion',
  templateUrl: './ipa-nav-accordion.component.html',
  styleUrls: ['./ipa-nav-accordion.component.css']
})
export class IpaNavAccordion {
  @Input() navAccordion: NavAccordion;
  @Input() isNavExpanded: boolean;

  constructor() {}
}
