import { SectionGroup } from '@core/models/section-group.model';
import { Activity } from '@core/models/activity.model';
import { SyncAction } from '@core/models/sync-action.model';

export interface Section {
  id: number;
  seats: number;
  crn: string;
  sequenceNumber: string;
  sectionGroup: SectionGroup;
  activities: Activity[];
  syncActions: SyncAction[];
  visible: boolean;
  crnRestricted: boolean;
}
