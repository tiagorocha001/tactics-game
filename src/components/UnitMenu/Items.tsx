import { useState } from 'react';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { type UnitProps, type ItemType } from '../../data/types';
import { items } from '../../data/items';
import { baseIcon } from '../../assets/baseIcons';
import styles from './styles.module.css';

export interface Props {
  armySelect: UnitProps | null;
  ref: HTMLDivElement;
}

export const Items = forwardRef<HTMLDivElement, Props>(
  ({ armySelect }, ref) => {
    const [selectedCategory, setSelectedCategory] = useState<ItemType>('potion');

    const categories = Object.keys(items);

    const handleCategoryClick = (category: ItemType) => {
      setSelectedCategory(category);
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
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category as ItemType)}
              disabled={selectedCategory === category}
              className={styles.itemTabButton}
            >
              {category}
            </button>
          ))}

          {selectedCategory && (
            <div className={styles.itemListRightPanelList}>
              {items[selectedCategory].map((item, index) => (
                <div key={index}>
                  <div className={styles.itemListNameBar}>
                    {item.name}
                    <div>
                      <span className={styles.itemListRarity}>{item.rarity}</span>
                      <span className={styles.itemListEffect}>{baseIcon.smallSword} {item.effectValue}</span>
                    </div>
                  </div>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);
