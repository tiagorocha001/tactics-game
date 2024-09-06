/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { convertToPercentage } from "../../utils";
import { ArmyType } from "../../data/types";
import { GridItem } from "../../data/types";
import { PathActive } from "../Map";
import { COREVALUES } from "../../data/consts";
import styles from "./styles.module.css";

const blockSize = COREVALUES.combatMap.blockSize;

interface Props {
  id: string;
  faction: number;
  race: string;
  type: ArmyType;
  life: number;
  lifeRef: number;
  rank: number;
  y: number;
  x: number;
  index: number;
  setArmySelect: Dispatch<
    SetStateAction<{
      y: number;
      x: number;
      active: boolean;
      copy: ArmyPropsWithoutSelect | null;
    }>
  >;
  setMap: Dispatch<SetStateAction<GridItem[]>>;
  pathFinal: PathActive[];
  armySelect: ArmySelect;
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
}

export type ArmyPropsWithoutSelect = Omit<
  Props,
  | "setArmySelect"
  | "pathFinal"
  | "armySelect"
  | "setMap"
  | "armyLocationIdIndex"
  | "setArmyLocationIdIndex"
  | "map"
>;

export interface ArmySelect {
  y: number;
  x: number;
  active: boolean;
  copy: ArmyPropsWithoutSelect | null;
}

export const Army = ({
  id,
  faction,
  race,
  type,
  life,
  lifeRef,
  rank,
  y,
  x,
  index,
  setArmySelect,
  armySelect,
  pathFinal,
  setMap,
  armyLocationIdIndex,
  setArmyLocationIdIndex,
  map,
}: Props) => {
  const [active, setActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation path values
  const [animateValues, setAnimateValues] = useState<{
    x: number[];
    y: number[];
  }>({ x: [], y: [] });

  const currentLife = convertToPercentage(lifeRef, life);

  // Select current army
  const handleArmySelection = () => {
    setArmySelect({
      y,
      x,
      active: true,
      copy: {
        id,
        faction,
        race,
        type,
        life,
        lifeRef,
        rank,
        y,
        x,
        index,
      },
    });
  };

  // Only activate animation for the current selected army
  useEffect(() => {
    if (armySelect?.copy?.id === id) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [armySelect, id]);

  // Generate keyframes
  function generateAnimationData(data: PathActive[]) {
    let prevX, prevY;
    const xList: number[] = [];
    const yList: number[] = [];
    const newData = JSON.parse(JSON.stringify(data));
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
      const newMap = JSON.parse(JSON.stringify(map));
      newMap[armyLocationIdIndex.newIndex].army = newMap[armyLocationIdIndex.currentIndex].army;
      newMap[armyLocationIdIndex.currentIndex].army = "";
      setMap(newMap);
      setIsAnimating(false);
      setArmyLocationIdIndex({ currentIndex: null, newIndex: null });
    }
  }

  useEffect(() => {
    if (pathFinal.length > 0) {
      generateAnimationData(pathFinal);
    }
  }, [pathFinal]);

  return (
    <motion.div
      className={`unit ${styles.army} ${styles[`army-${race}-${type}`]}`}
      onClick={() => !isAnimating && handleArmySelection()}
      id={`${type}-${y}-${x}`}
      animate={{ x: animateValues.x, y: animateValues.y }}
      onAnimationComplete={changeArmyPositionOnMap}
      onAnimationStart={() => armyLocationIdIndex.newIndex && armyLocationIdIndex.currentIndex && setIsAnimating(true)}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 1.5 }}
      transition={{ duration: animateValues.x.length * 0.2, damping: 20, stiffness: 300 }}
      style={{ pointerEvents: isAnimating ? "none" : "auto" }}
    >
      <div
        style={{
          background: `linear-gradient(to right, red ${currentLife}, black ${currentLife})`,
        }}
        className="life-bar"
      ></div>
    </motion.div>
  );
};
