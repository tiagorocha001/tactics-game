import type { UnitProps} from '../data/types';
import { UnitFaction } from '../data/types';
import { generateId } from '../utils'

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
        id: generateId(UnitFaction.humanA, 0, 'human', 'city'),
        faction: UnitFaction.humanA,
        race: 'human',
        type: {
          type: 'building',
          subType: 'city',
        },
        life: 55,
        lifeRef: 80,
        rank: 0,
        y: y0,
        x: x0,
        index: 0,
        movePoints: 0,
      }
    ],
    [
      {
        id: generateId(UnitFaction.orcA, 0, 'orc', 'city'),
        faction: UnitFaction.orcA,
        race: 'orc',
        type: {
          type: 'building',
          subType: 'city',
        },
        life: 74,
        lifeRef: 80,
        rank: 0,
        y: y1,
        x: x1,
        index: 1,
        movePoints: 0,
      },
    ],
  ];
}
