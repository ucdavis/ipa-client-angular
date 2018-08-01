import { Component, Input } from '@angular/core';
import { INavAccordion } from '@core/components/ipa-nav/nav-accordion.model';

@Component({
  selector: 'ipa-nav-accordion',
  templateUrl: './ipa-nav-accordion.component.html',
  styleUrls: ['./ipa-nav-accordion.component.css']
})
export class IpaNavAccordion {
  @Input() navAccordion: INavAccordion;
  @Input() isNavExpanded: boolean;
  @Input() activeAccordion: boolean;
  @Input() activePage: string;
}
