import { items } from './items';
import { type ArmyProps, ArmyRankMovePoints, ArmyAttackPoints, UnitFaction } from '../data/types';
import { generateId } from '../utils'

export interface InitialPosition {
  y0: number;
  x0: number;
  y1: number;
  x1: number;
}

export function initialArmyState({y0, x0, y1, x1}: InitialPosition): ArmyProps[][] {
  return [
    [
      {
        attack: ArmyAttackPoints[1],
        experiencePoints: 0,
        id: generateId(UnitFaction.humanA, 0, 'human', 'knight'),
        faction: UnitFaction.humanA,
        race: 'human',
        type: {
          type: 'unit',
          subType: 'knight',
        },
        life: 80,
        lifeRef: 80,
        movePoints: ArmyRankMovePoints[1],
        movePointsRef: ArmyRankMovePoints[1],
        rank: 1,
        y: y0,
        x: x0,
        index: 0,
        items: structuredClone(items),
      },
      {
        attack: ArmyAttackPoints[1],
        experiencePoints: 0,
        id: generateId(UnitFaction.humanA, 1, 'human', 'knight'),
        faction: UnitFaction.humanA,
        race: 'human',
        type: {
          type: 'unit',
          subType: 'knight',
        },
        life: 80,
        lifeRef: 80,
        movePoints: ArmyRankMovePoints[1],
        movePointsRef: ArmyRankMovePoints[1],
        rank: 1,
        y: 1,
        x: 1,
        index: 0,
        items: structuredClone(items),
      }
    ],
    [
      {
        attack: ArmyAttackPoints[1],
        experiencePoints: 0,
        id: generateId(UnitFaction.orcA, 0, 'orc', 'knight'),
        faction: UnitFaction.orcA,
        race: 'orc',
        type: {
          type: 'unit',
          subType: 'knight',
        },
        life: 80,
        lifeRef: 80,
        movePoints: ArmyRankMovePoints[4],
        movePointsRef: ArmyRankMovePoints[4],
        rank: 1,
        y: y1,
        x: x1,
        index: 0,
        items: structuredClone(items),
      },
    ],
  ];
}
