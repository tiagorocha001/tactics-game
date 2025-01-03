import { type LegacyRef } from 'react';
import { motion } from 'framer-motion';
import { type BaseProps, type ArmyProps, type ArmyType, armyAttackBonuses } from '../../data/types';
import styles from './styles.module.css';

export interface Props {
  armySelect: BaseProps | ArmyProps | null;
  ref: LegacyRef<HTMLDivElement> | undefined;
}

export const Stats = (({ armySelect, ref } : Props) => {
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
        <div>{(armySelect as ArmyProps)?.attack}</div>
        <div>{armyAttackBonuses[armySelect?.type?.subType as ArmyType]}</div>
      </div>
    </motion.div>
  );
});