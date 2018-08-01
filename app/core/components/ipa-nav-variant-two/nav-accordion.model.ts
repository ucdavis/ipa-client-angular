import { INavLink } from './nav-link.model';

export interface INavAccordion {
  description: string;
  key: string;
  icon: string;
  links: INavLink[];
}
