import { type Item, type ItemType } from './types';

export const items: Record<ItemType, Item[]> = {
  potion: [
    {
      type: 'potion',
      name: 'Health Elixir',
      description: 'Cures 1 damage',
      rarity: 1,
      effects: 'Cure',
      effectValue: 1,
    },
  ],
  armor: [
    {
      type: 'armor',
      name: 'Plate Armor',
      description: 'Heavy armor providing excellent protection',
      rarity: 3,
      effects: 'Increase Defense',
      effectValue: 3,
    },
  ],
  weapon: [
    {
      type: 'weapon',
      name: 'Excalibur',
      description: 'The legendary sword of kings',
      rarity: 4,
      effects: 'Increase Attack',
      effectValue: 4,
    },
  ],
  talisman: [
    {
      type: 'talisman',
      name: 'Amulet of Strength',
      description: 'Enhances the wearer\'s physical power',
      rarity: 2,
      effects: 'Increase Attack',
      effectValue: 2,
    },
  ],
};