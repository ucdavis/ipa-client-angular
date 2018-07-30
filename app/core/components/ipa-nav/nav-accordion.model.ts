import { NavLink } from './nav-link.model';

export interface NavAccordion {
  description: string;
  key: string;
  icon: string;
  links: NavLink[];
}
