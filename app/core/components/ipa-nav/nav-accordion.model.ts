import { INavLink } from '@core/components/ipa-nav/nav-link.model';

export interface INavAccordion {
  description: string;
  key: string;
  icon: string;
  links: INavLink[];
}
