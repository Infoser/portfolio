import type { StructuredListContent } from '@/types/sections';

export const educationContent: StructuredListContent = {
  kind: 'structured-list',
  entries: [
    {
      id: 'bit-durg',
      title: 'B.Tech, Computer Science & Engineering (Data Science)',
      subtitle: 'Bhilai Institute of Technology, Durg',
      start: 'Sept 2023',
      end: 'Sept 2027',
      bullets: [
        'CPI: 8.31 (till 5th semester).',
        'Relevant coursework: Data Structures & Algorithms, Machine Learning, DBMS, Computer Networks, Statistics & Probability.',
      ],
      tags: ['BIT Durg', 'Data Science', 'CSE'],
    },
    {
      id: 'holy-cross-xii',
      title: 'XII CBSE',
      subtitle: 'Holy Cross Senior Secondary School, Raipur',
      start: '2022',
      end: '2022',
      bullets: [
        'Score: 75%.',
      ],
      tags: ['CBSE', 'Senior Secondary'],
    },
    {
      id: 'holy-cross-x',
      title: 'X CBSE',
      subtitle: 'Holy Cross Senior Secondary School, Raipur',
      start: '2020',
      end: '2020',
      bullets: [
        'Score: 85.7%.',
      ],
      tags: ['CBSE', 'Secondary'],
    },
  ],
};
