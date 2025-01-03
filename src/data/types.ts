export type UnitType = 'building' | 'unit';

export type UnitRace = 'human' | 'orc';

export enum UnitFaction {
  humanA = 'losnoth-kingdom',
  orcA = 'adhark-kingdom' 
}

// Base
export type BaseType =
  | 'castle'
  | 'city'
  | 'farm'
  | 'fortress'
  | 'template'
  | '';

export interface BaseProps extends UnitProps {
  garrison: string;
}

// Army
export type ArmyType = 'knight' | 'lancer' | 'archer' | 'mage' | 'wing';
export type ArmyAttack = 2 | 3 | 4 | 5;
export type ArmyMove = 8 | 10 | 12 | 50;
export type ArmyRank = 1 | 2 | 3 | 4;
export type AttackBonusMap = Record<ArmyType, ArmyType>;

export const armyAttackBonuses: AttackBonusMap = {
  knight: 'archer',    // knight has bonus vs archer
  lancer: 'knight',    // lancer has bonus vs knight
  archer: 'wing',      // archer has bonus vs wing
  mage: 'lancer',      // mage has bonus vs lancer
  wing: 'mage'         // wing has bonus vs mage
};

export const ArmyRankMovePoints: Record<ArmyRank, ArmyMove> = {
  1: 8,
  2: 10,
  3: 12,
  4: 50,
};

export const ArmyAttackPoints: Record<ArmyRank, ArmyAttack> = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
};

export interface ArmyProps extends UnitProps {
  attack: number;
  movePointsRef: ArmyMove;
  experiencePoints: number;
  items: Record<ItemType, Item[]>;
  itemInUse: Record<ItemType, Item | undefined>;
}

// Action
export enum Action {
  openedMenu = 'openedMenu',
  move = 'move',
  attack = 'attack',
  item = 'item',
  stats = 'stats',
  armyList = 'army list',
  close = 'close',
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
  faction: UnitFaction;
  race: UnitRace;
  type: {
    type: UnitType;
    subType: BaseType | ArmyType;
  };
  life: number;
  lifeRef: number;
  rank: number;
  y: number;
  x: number;
  index: number;
  movePoints: number;
}

// Items
export type ItemType = 'potion' | 'armor' | 'weapon' | 'talisman';

type ItemRarity = 1 | 2 | 3 | 4;

type ItemEffectValue = 1 | 2 | 3 | 4;

type ItemPotionEffect = 'Cure' | 'Revive' | 'Antidote';
type ItemArmorEffect = 'Increase Defense';
type ItemWeaponEffect = 'Increase Attack';
type ItemTalismanEffect =
  | 'Increase Attack'
  | 'Increase Defense'
  | 'Increase Movement'
  | 'Resistant to Magic';

export interface Item {
  type: ItemType;
  name: string;
  description: string;
  rarity: ItemRarity;
  effects:
    | ItemPotionEffect
    | ItemArmorEffect
    | ItemWeaponEffect
    | ItemTalismanEffect;
  effectValue: ItemEffectValue;
}
