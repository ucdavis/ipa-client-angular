import { Section } from '@core/models/section.model';
import { SectionGroup } from '@core/models/section-group.model';

export interface SyncAction {
  id: number;
  sectionProperty: string;
  childProperty: string;
  childUniqueKey: string;
  section: Section;
  sectionGroup: SectionGroup;
}
