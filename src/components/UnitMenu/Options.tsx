import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import styles from './styles.module.css';
import { Action, UnitProps } from '../../data/types';

interface Props {
  setAction: (action: Action) => void;
  armySelect: UnitProps | null;
  ref: HTMLDivElement;
}

export const Options = forwardRef<HTMLDivElement, Props>(({ setAction, armySelect }, ref) => {
  const isMovementPossible = armySelect?.movePoints ? armySelect?.movePoints > 0 : false;

  return (
    <motion.div
      ref={ref}
      className={styles.unitMenu}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {Object.values(Action).map((item) => {
        if (item === Action.openedMenu) return null;
        return (
          <button
            key={`unit-menu-${item}`}
            id={item}
            onClick={() => setAction(item)}
            disabled={item === Action.move && !isMovementPossible}
          >
            {item}
          </button>
        );
      })}
    </motion.div>
  );
});
