export interface ScheduleSummary {
  title: string;
  section: string;
  CRN: number;
  enrollment: string;
  seats: number;
  activities: { type: string; days: string; start: string; end: string; location: string }[];
}
