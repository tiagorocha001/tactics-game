import { useState } from 'react';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import swordIcon from '../../assets/menu/sword.png';
import {
  type UnitProps,
  type ArmyProps,
  type ItemType,
  type Item,
  type ArmyType,
  armyAttackBonuses,
} from '../../data/types';
import styles from './styles.module.css';

export interface Props {
  armySelect: UnitProps | UnitProps & ArmyProps | null;
  armies: (UnitProps & ArmyProps)[][];
  setArmies: (armies: (UnitProps & ArmyProps)[][]) => void;
  ref: HTMLDivElement;
}

export const Items = forwardRef<HTMLDivElement, Props>(
  ({ armySelect, setArmies, armies }, ref) => {
    const [selectedCategory, setSelectedCategory] =
      useState<ItemType>('potion');

    const categories = Object.keys(
      (armySelect as ArmyProps)?.items as Record<ItemType, Item[]>
    );

    const handleCategoryClick = (category: ItemType) => {
      setSelectedCategory(category);
    };

    const handleAssetName = (name: string, value: number, category: string) => {
      const newName = name.toLowerCase().replace(/ /g, '-') + '-' + value;
      return `/src/assets/items/${category}/${newName}.gif`;
    };

      const handleItemUse = (itemType: ItemType) => {
          const newArmyList = [...armies];
          for (const subList of newArmyList) {
            for (const item of subList) {
              if (item.id === armySelect?.id) {
                if (itemType === 'armor'){
                  return;
                } else if(itemType === 'potion') {
                  return;
                } else if(itemType === 'talisman') {
                  return;
                } else if(itemType === 'weapon') {
                  return;
                }
                return;
              }
            }
          }
          setArmies([...newArmyList]);
      };
    return (
      <motion.div
        ref={ref}
        className={styles.itemList}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={styles.itemListLeftPanel}>
          <div>race: {armySelect?.race}</div>
          <div>type: {armySelect?.type.subType}</div>
          <div>
            life: {armySelect?.life} / {armySelect?.lifeRef}
          </div>
          <div>rank: {armySelect?.rank}</div>
          <div>attack: {(armySelect as ArmyProps)?.attack}</div>
          <div>
            strong vs:{' '}
            {armyAttackBonuses[armySelect?.type?.subType as ArmyType]}
          </div>
        </div>
        <div className={styles.itemListRightPanel}>
          <div className={styles.itemListRightPanelTabs}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category as ItemType)}
                disabled={selectedCategory === category}
                className={styles.itemTabButton}
              >
                <img src={swordIcon} /> {category}
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className={styles.itemListRightPanelList}>
              {((armySelect as ArmyProps)?.items as Record<ItemType, Item[]>)[
                selectedCategory
              ].map((item, index) => (
                <div key={index} className={styles.itemListEntry} role="button" onClick={() => handleItemUse(item.type)}>
                  <img
                    src={handleAssetName(
                      item.name,
                      item.effectValue,
                      item.type
                    )}
                  />
                  <div>
                    <div className={styles.itemListNameBar}>
                      <div>{item.name}</div>
                      <div className={styles.itemListNameBarNumberLabels}>
                        <abbr
                          title="Item Rarity"
                          className={styles.itemListRarity}
                        >
                          {item.rarity}
                        </abbr>
                        <abbr
                          title="Item Level"
                          className={styles.itemListEffect}
                        >
                          {item.effectValue}
                        </abbr>
                      </div>
                    </div>

                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);
