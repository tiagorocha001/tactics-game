import { UnitProps } from '../data/types';

export interface InitialPosition {
  y0: number;
  x0: number;
  y1: number;
  x1: number;
}

export function initialBaseState({y0, x0, y1, x1}: InitialPosition): UnitProps[][] {
  return [
    [
      {
        id: '0-0-human-base',
        faction: 0,
        race: 'human',
        type: 'city',
        life: 55,
        lifeRef: 80,
        rank: 0,
        y: y0,
        x: x0,
        index: 0,
      }
    ],
    [
      {
        id: '1-0-orc-base',
        faction: 1,
        race: 'orc',
        type: 'city',
        life: 74,
        lifeRef: 80,
        rank: 0,
        y: y1,
        x: x1,
        index: 1,
      },
    ],
  ];
}
