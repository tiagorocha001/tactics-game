import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { type UnitProps, type ArmyProps, type ArmyType, armyAttackBonuses } from '../../data/types';
import styles from './styles.module.css';

export interface Props {
  armySelect: UnitProps & ArmyProps | null;
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
        <div>attack</div>
        <div>strong vs</div>
      </div>
      <div className={styles.armyListRows}>
        <div>{armySelect?.race}</div>
        <div>{armySelect?.type.subType}</div>
        <div>{armySelect?.life} / {armySelect?.lifeRef}</div>
        <div>{armySelect?.rank}</div>
        <div>{armySelect?.attack}</div>
        <div>{armyAttackBonuses[armySelect?.type?.subType as ArmyType]}</div>
      </div>
    </motion.div>
  );
});