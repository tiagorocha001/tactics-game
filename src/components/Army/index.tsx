import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// Utils
import { convertToPercentage } from '../../utils';
import { COREVALUES } from '../../data/consts';
// Types
import type { Dispatch, SetStateAction} from 'react';
import type { PathActive } from '../Map';
import { Action } from '../../data/types';
import { type UnitProps } from '../../data/types';
import type { GridItem } from '../../data/types';
// Style
import styles from './styles.module.css';

const blockSize = COREVALUES.combatMap.blockSize;

interface Props extends UnitProps {
  setUnitSelected: (unitSelected: UnitProps | null) => void;
  unitSelected: UnitProps | null;
  setMap: (map: GridItem[]) => void;
  pathFinal: PathActive[];
  armyLocationIdIndex: {
    currentIndex: number | null;
    newIndex: number | null;
  };
  setArmyLocationIdIndex: Dispatch<
    SetStateAction<{
      currentIndex: number | null;
      newIndex: number | null;
    }>
  >;
  map: GridItem[];
  isAnimating: boolean;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
  setAction: (action: Action) => void;
}

export const Army = ({
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
  items,
  // Local state props
  setUnitSelected,
  unitSelected,
  pathFinal,
  setMap,
  armyLocationIdIndex,
  setArmyLocationIdIndex,
  map,
  isAnimating,
  setIsAnimating,
  setAction,
}: Props) => {
  const [active, setActive] = useState(false);

  // Animation path values
  const [animateValues, setAnimateValues] = useState<{
    x: number[];
    y: number[];
  }>({ x: [], y: [] });

  const currentLife = convertToPercentage(lifeRef, life);

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
      items
    });
    setAction(Action.openedMenu);
  }

  // Only activate animation for the current selected army
  useEffect(() => {
    if (unitSelected?.id === id) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [unitSelected, id]);

  // Generate keyframes
  function generateAnimationData(data: PathActive[]) {
    let prevX, prevY;
    const xList: number[] = [];
    const yList: number[] = [];
    const newData = structuredClone(data);
    newData.reverse();

    for (const point of newData) {
      const x = point.x;
      const y = point.y;

      // x
      if (prevX === undefined || prevX !== x) {
        xList.push(
          !prevX
            ? 0
            : (xList.at(-1) as number) +
                ((prevX as number) > (x as number) ? -blockSize : blockSize)
        );
      } else {
        xList.push(xList.at(-1) as number);
      }

      // y
      if (prevY === undefined || prevY !== y) {
        yList.push(
          !prevY
            ? 0
            : (yList.at(-1) as number) +
                ((prevY as number) > (y as number) ? -blockSize : blockSize)
        );
      } else {
        yList.push(yList.at(-1) as number);
      }

      prevX = x;
      prevY = y;
    }

    active && setAnimateValues({ x: xList, y: yList });
  }

  // On Animation Over - Add army ID to new map position
  function changeArmyPositionOnMap() {
    if (armyLocationIdIndex.newIndex && armyLocationIdIndex.currentIndex) {
      setAnimateValues({ x: [], y: [] });
      const newMap = structuredClone(map);
      newMap[armyLocationIdIndex.newIndex].army =
        newMap[armyLocationIdIndex.currentIndex].army;
      newMap[armyLocationIdIndex.currentIndex].army = '';
      setMap(newMap);
      setIsAnimating(false);
      setArmyLocationIdIndex({ currentIndex: null, newIndex: null });
      setAction(Action.close);
    }
  }

  useEffect(() => {
    if (pathFinal.length > 0) {
      generateAnimationData(pathFinal);
    }
  }, [pathFinal]);

  return (
    <motion.div
      id={`${type.subType}-${y}-${x}`}
      className={`unit ${styles.army} ${styles[`army-${race}-${faction}-${type.subType}`]} ${active && styles.active}`}
      style={{ pointerEvents: isAnimating ? 'none' : 'auto' }}
      onClick={() => !isAnimating && handleUnitSelection()}
      animate={{ x: animateValues.x, y: animateValues.y }}
      onAnimationComplete={changeArmyPositionOnMap}
      onAnimationStart={() =>
        armyLocationIdIndex.newIndex &&
        armyLocationIdIndex.currentIndex &&
        setIsAnimating(true)
      }
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 1.5 }}
      transition={{
        duration: animateValues.x.length * 0.2,
        damping: 20,
        stiffness: 300,
      }}
    >
      <div
        style={{
          background: `linear-gradient(to right, red ${currentLife}, black ${currentLife})`,
        }}
        className='life-bar'
      ></div>
    </motion.div>
  );
};
