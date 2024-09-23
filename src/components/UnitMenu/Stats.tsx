import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { type UnitProps } from '../../data/types';
import styles from './styles.module.css';

export interface Props {
  armySelect: UnitProps | null;
  ref: HTMLDivElement;
}

export const Stats = forwardRef<HTMLDivElement, Props>(({ armySelect }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={styles.armyList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.armyListRows}>
        <div>race</div>
        <div>type</div>
        <div>life</div>
        <div>rank</div>
      </div>
      <div className={styles.armyListRows}>
        <div>{armySelect?.race}</div>
        <div>{armySelect?.type}</div>
        <div>{armySelect?.life} / {armySelect?.lifeRef}</div>
        <div>{armySelect?.rank}</div>
      </div>
    </motion.div>
  );
});