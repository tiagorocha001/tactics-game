import { items } from './items';
import { type UnitProps, ArmyLevelMovePoints, UnitType } from '../data/types';

export interface InitialPosition {
  y0: number;
  x0: number;
  y1: number;
  x1: number;
}

export function initialArmyState({y0, x0, y1, x1}: InitialPosition): UnitProps[][] {
  return [
    [
      {
        id: '0-0-human-knight',
        faction: 0,
        race: 'human',
        type: {
          type: UnitType.unit,
          subType: 'knight',
        },
        life: 80,
        lifeRef: 80,
        movePoints: ArmyLevelMovePoints[1],
        movePointsRef: ArmyLevelMovePoints[1],
        rank: 1,
        y: y0,
        x: x0,
        index: 0,
        items: structuredClone(items),
      },
      {
        id: '0-1-human-knight',
        faction: 0,
        race: 'human',
        type: {
          type: UnitType.unit,
          subType: 'knight',
        },
        life: 80,
        lifeRef: 80,
        movePoints: ArmyLevelMovePoints[1],
        movePointsRef: ArmyLevelMovePoints[1],
        rank: 1,
        y: 1,
        x: 1,
        index: 0,
        items: structuredClone(items),
      }
    ],
    [
      {
        id: '1-0-orc-knight',
        faction: 1,
        race: 'orc',
        type: {
          type: UnitType.unit,
          subType: 'knight',
        },
        life: 80,
        lifeRef: 80,
        movePoints: ArmyLevelMovePoints[4],
        movePointsRef: ArmyLevelMovePoints[4],
        rank: 1,
        y: y1,
        x: x1,
        index: 0,
        items: structuredClone(items),
      },
    ],
  ];
}
