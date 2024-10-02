import { useState } from 'react';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { type UnitProps, type ItemType } from '../../data/types';
import { items } from '../../data/items';
import swordIcon from '../../assets/menu/sword.png';
import styles from './styles.module.css';

export interface Props {
  armySelect: UnitProps | null;
  ref: HTMLDivElement;
}

export const Items = forwardRef<HTMLDivElement, Props>(
  ({ armySelect }, ref) => {
    const [selectedCategory, setSelectedCategory] =
      useState<ItemType>('potion');

    const categories = Object.keys(items);

    const handleCategoryClick = (category: ItemType) => {
      setSelectedCategory(category);
    };

    const handleAssetName = (name: string, value: number, category: string) => {
      const newName = name.toLowerCase().replace(/ /g, '-') + '-' + value;
      return `/src/assets/items/${category}/${newName}.gif`
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
          <div>race</div>
          <div>{armySelect?.race}</div>
          <div>type</div>
          <div>{armySelect?.type}</div>
          <div>life</div>
          <div>
            {armySelect?.life} / {armySelect?.lifeRef}
          </div>
          <div>rank</div>
          <div>{armySelect?.rank}</div>
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
              {items[selectedCategory].map((item, index) => (
                <div key={index} className={styles.itemListEntry}>
                  <img
                    src={handleAssetName(item.name, item.effectValue, item.type)}
                  />
                  <div>
                    <div className={styles.itemListNameBar}>
                      <div>
                        {item.name}
                      </div>
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
