export interface ScheduleSummary {
  title: string;
  section: string;
  CRN: number;
  enrollment: string;
  seats: number;
  activities: { type: string; days: string; start: string; end: string; location: string }[];
}

export const DATA: ScheduleSummary[] = [
  {
    title: 'ECS 010 Intro to Programming',
    section: 'A001',
    CRN: 123456,
    enrollment: 'H',
    seats: 0,
    activities: [
      {
        type: 'lecture',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      },
      {
        type: 'discussion',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      }
    ]
  },
  {
    title: 'ECS 010 Intro to Programming',
    section: 'A002',
    CRN: 123457,
    enrollment: 'H',
    seats: 0,
    activities: [
      {
        type: 'lecture',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      }
    ]
  },
  {
    title: 'ECS 010 Intro to Programming',
    section: 'A003',
    CRN: 123458,
    enrollment: 'H',
    seats: 0,
    activities: [
      {
        type: 'lecture',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      }
    ]
  },
  {
    title: 'ECS 015 Intro to Computers',
    section: 'A001',
    CRN: 4.0026,
    enrollment: 'He',
    seats: 0,
    activities: [
      {
        type: 'lecture',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      }
    ]
  },
  {
    title: 'ECS 015 Intro to Computers',
    section: 'A002',
    CRN: 6.941,
    enrollment: 'Li',
    seats: 0,
    activities: [
      {
        type: 'lecture',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      },
      {
        type: 'discussion',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      }
    ]
  },
  {
    title: 'ECS 020 Discrete Math for CS',
    section: 'A001',
    CRN: 9.0122,
    enrollment: 'Be',
    seats: 0,
    activities: [
      {
        type: 'lecture',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      },
      {
        type: 'discussion',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      }
    ]
  },
  {
    title: 'ECS 020 Discrete Math for CS',
    section: 'A002',
    CRN: 10.811,
    enrollment: 'B',
    seats: 0,
    activities: [
      {
        type: 'lecture',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      },
      {
        type: 'discussion',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      }
    ]
  },
  {
    title: 'ECS 020 Discrete Math for CS',
    section: 'A003',
    CRN: 12.0107,
    enrollment: 'C',
    seats: 0,
    activities: [
      {
        type: 'lecture',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      }
    ]
  },
  {
    title: 'ECS 030 Programming&Prob Solving',
    section: 'A001',
    CRN: 14.0067,
    enrollment: 'N',
    seats: 0,
    activities: [
      {
        type: 'lecture',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      }
    ]
  },
  {
    title: 'ECS 030 Programming&Prob Solving',
    section: 'A002',
    CRN: 15.9994,
    enrollment: 'O',
    seats: 0,
    activities: [
      {
        type: 'lecture',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      }
    ]
  },
  {
    title: 'ECS 040 Software &Obj-Orient Prg',
    section: 'A001',
    CRN: 18.9984,
    enrollment: 'F',
    seats: 0,
    activities: [
      {
        type: 'lecture',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      },
      {
        type: 'discussion',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      }
    ]
  },
  {
    title: 'ECS 050 Machine Dependent Prog',
    section: 'A001',
    CRN: 20.1797,
    enrollment: 'Ne',
    seats: 0,
    activities: [
      {
        type: 'lecture',
        days: 'none',
        start: 'none',
        end: 'none',
        location: 'death-star'
      }
    ]
  }
];
