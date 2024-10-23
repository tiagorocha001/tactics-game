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
  armySelect: (UnitProps & ArmyProps) | null;
  ref: HTMLDivElement;
}

export const Items = forwardRef<HTMLDivElement, Props>(
  ({ armySelect }, ref) => {
    const [selectedCategory, setSelectedCategory] =
      useState<ItemType>('potion');

    const categories = Object.keys(
      armySelect?.items as Record<ItemType, Item[]>
    );

    const handleCategoryClick = (category: ItemType) => {
      setSelectedCategory(category);
    };

    const handleAssetName = (name: string, value: number, category: string) => {
      const newName = name.toLowerCase().replace(/ /g, '-') + '-' + value;
      return `/src/assets/items/${category}/${newName}.gif`;
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
          <div>attack: {armySelect?.attack}</div>
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
              {(armySelect?.items as Record<ItemType, Item[]>)[
                selectedCategory
              ].map((item, index) => (
                <div key={index} className={styles.itemListEntry}>
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
