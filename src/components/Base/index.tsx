import { convertToPercentage } from '../../utils';
// Types
import { Action } from '../../data/types';
import { UnitProps } from '../../data/types';
// Style
import styles from './styles.module.css';

interface Props extends UnitProps {
  setUnitSelected: (unitSelected: UnitProps | null) => void;
  setAction: (action: Action) => void;
}

export const Base = ({
  id,
  faction,
  race,
  type,
  life,
  lifeRef,
  movePoints,
  movePointsRef,
  rank,
  y,
  x,
  index,
  setUnitSelected,
  setAction
}: Props) => {
  // Select current army
  function handleUnitSelection() {
    setUnitSelected({
      id,
      faction,
      race,
      type,
      life,
      lifeRef,
      movePoints,
      movePointsRef,
      rank,
      y,
      x,
      index,
    });
    setAction(Action.openedMenu);
  }

  const currentLife = convertToPercentage(lifeRef, life);
  return (
    <div
      className={`unit ${styles.base} ${styles[`base-${faction}-${type.subType}`]}`}
      onClick={() => handleUnitSelection()}
    >
      <div
        style={{
          background: `linear-gradient(to right, red ${currentLife}, black ${currentLife})`,
        }}
        className="life-bar"
      ></div>
    </div>
  );
};
