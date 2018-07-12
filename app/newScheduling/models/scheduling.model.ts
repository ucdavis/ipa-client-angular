interface Courses {
  loading: boolean;
  list: Array<any>;
}

export interface SchedulingState {
  name: string;
  showName: boolean;
  courses: Courses;
}
