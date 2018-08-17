import { Section } from '@core/models/section.model';
import { SectionGroup } from '@core/models/section-group.model';

enum ActivityState {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  CONFIRMED = 'Confirmed'
}

interface ActivityType {
  activityTypeCode: string;
}

export interface Activity {
  id: number;
  section: Section;
  sectionGroup: SectionGroup;
  beginDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  dayIndicator: string;
  bannerLocation: string;
  activityState: ActivityState;
  frequency: number;
  virtual;
  syncLocation: boolean;
  location: Location;
  activityTypeCode: ActivityType;
}
