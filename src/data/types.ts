// Base
export type BaseType = 'castle' | 'city' | 'farm' | 'fortress' | 'template' | '';

// Army
export type ArmyType = 'knight' | 'lancer' | 'archer' | 'mage' | '';

// Army move ref
export type ArmyMove = 8 | 10 | 12;

// Army move ref
export type ArmyLevel = 1 | 2 | 3 | 4; 

// Army Level and Move Points Mapping
export const ArmyLevelMovePoints: Record<ArmyLevel, ArmyMove> = {
  1: 8,
  2: 10,
  3: 12,
  4: 12 
};

// Action
export enum Action {
  move = 'move',
  attack = 'attack',
  item = 'item',
  reset = 'reset',
  none = 'none'
}

// Turn
export enum Turn {
  player = 'player',
  enemy = 'enemy',
}

// Terrain
type WaveTerrain = 'G' | 'S' | 'M' | 'F' | 'W' | string;
type AboveTerrain = 'mountain' | 'forest' | '';

export interface GridItem {
  id: string;
  terrain: WaveTerrain;
  aboveTerrain: AboveTerrain; // TODO: Keep or delete?
  x: number;
  y: number;
  rangeCheck: boolean;
  rangeValue: number;
  pathActive: boolean;
  army: string;
  base: string;
}

export interface UnitProps {
  id: string;
  faction: number;
  race: string;
  type: BaseType | ArmyType;
  life: number;
  lifeRef: number;
  rank: number;
  movePoints?: number,
  movePointsRef?: ArmyMove,
  y: number;
  x: number;
  index: number;
}