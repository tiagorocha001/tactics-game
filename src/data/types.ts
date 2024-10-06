// Base
export type BaseType = 'castle' | 'city' | 'farm' | 'fortress' | 'template' | '';

// Army
export type ArmyType = 'knight' | 'lancer' | 'archer' | 'mage' | '';
export type ArmyMove = 8 | 10 | 12 | 50;
export type ArmyLevel = 1 | 2 | 3 | 4; 

export const ArmyLevelMovePoints: Record<ArmyLevel, ArmyMove> = {
  1: 8,
  2: 10,
  3: 12,
  4: 50 
};

// Action
export enum Action {
  openedMenu = 'openedMenu',
  move = 'move',
  attack = 'attack',
  item = 'item',
  stats = 'stats',
  armyList = 'army list',
  close = 'close'
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
  y: number;
  x: number;
  index: number;
  // Army stats
  movePoints?: number;
  movePointsRef?: ArmyMove;
  experience?: number;
  items?: Item[]
  // Base
}

// Items
export type ItemType = 'potion' | 'armor' | 'weapon' | 'talisman';

type ItemRarity = 1 | 2 | 3 | 4;

type ItemEffectValue = 1 | 2 | 3 | 4;

type ItemPotionEffect = 'Cure' | 'Revive' | 'Antidote';
type ItemArmorEffect = 'Increase Defense';
type ItemWeaponEffect = 'Increase Attack';
type ItemTalismanEffect = 'Increase Attack' | 'Increase Defense' | 'Increase Movement' | 'Resistant to Magic';

export interface Item {
  type: ItemType;
  name: string;
  description: string;
  rarity: ItemRarity;
  effects: ItemPotionEffect | ItemArmorEffect | ItemWeaponEffect | ItemTalismanEffect;
  effectValue: ItemEffectValue;
}