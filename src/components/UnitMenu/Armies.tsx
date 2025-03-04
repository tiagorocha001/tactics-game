import { type LegacyRef } from 'react';
import { motion } from 'framer-motion';
import { type UnitProps } from '../../data/types';
import styles from './styles.module.css';
import armyStyles from '../Army/styles.module.css';

export interface Props {
  armies: UnitProps[][];
  ref: LegacyRef<HTMLDivElement> | undefined;
}

export const Armies = (({ armies, ref }: Props) => {
  return (
    <motion.div
      ref={ref}
      className={styles.armyList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.armyListRows}>
        <div style={{ height: '50px', width: '50px' }}></div>
        <div>race</div>
        <div>army health</div>
        <div>type</div>
        <div>pos y/x</div>
      </div>
      {armies[0].length > 0 &&
        armies[0].map((item, index) => {
          return (
            <div className={styles.armyListRows} key={`army-list-${index}`}>
              <div
                className={`unit ${
                  armyStyles[`army-${item.race}-${item.type.subType}`]
                }`}
                style={{ height: '50px', width: '50px' }}
              ></div>
              <div>{item.race}</div>
              <div>{item.life}</div>
              <div>{item.type.subType}</div>
              <div>
                {item.y}/{item.x}
              </div>
            </div>
          );
        })}
    </motion.div>
  );
});
