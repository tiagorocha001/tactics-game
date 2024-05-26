/* eslint-disable react-hooks/exhaustive-deps */
import { convertToPercentage } from "../../utils";
import { ArmyType } from "../../data/types";
import { useEffect, Dispatch, SetStateAction, useState } from "react";
import { GridItem } from "../../data/types";
import { PathActive } from "../Map";
import { motion } from "framer-motion";
import styles from "./styles.module.css";

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
    currentIndex: number;
    newIndex: number;
  };
  map: GridItem[];
}

export type ArmyPropsWithoutSelect = Omit<
  Props,
  | "setArmySelect"
  | "isMoveActive"
  | "pathFinal"
  | "armySelect"
  | "setMap"
  | "armyLocationIdIndex"
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
  map,
}: Props) => {
  const [active, setActive] = useState(false);
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

    for (const point of data) {
      const x = point.x;
      const y = point.y;

      if (prevX === undefined || prevX !== x) {
        xList.push(
          prevX === undefined
            ? 0
            : xList[xList.length - 1] +
                ((prevX as number) < (x as number) ? -54 : 54)
        );
      } else {
        xList.push(xList[xList.length - 1]);
      }

      if (prevY === undefined || prevY !== y) {
        yList.push(
          prevY === undefined
            ? 0
            : yList[yList.length - 1] +
                ((prevY as number) < (y as number) ? -54 : 54)
        );
      } else {
        yList.push(yList[yList.length - 1]);
      }

      prevX = x;
      prevY = y;
    }
    console.log({ x: xList, y: yList });
    active && setAnimateValues({ x: xList, y: yList });
  }

  // On Animation Over - Add army ID to new map position
  function changeArmyPostionOnMap() {
    const newMap = [...map];
    newMap[armyLocationIdIndex.newIndex].army = id;
    newMap[armyLocationIdIndex.currentIndex].army = "";
    setMap(newMap);
  }

  useEffect(() => {
    if (pathFinal.length > 0) {
      generateAnimationData(pathFinal);
    }
  }, [pathFinal]);

  return (
    <motion.div
      className={`unit ${styles.army} ${styles[`army-${race}-${type}`]}`}
      onClick={() => handleArmySelection()}
      id={`${type}-${y}-${x}`}
      animate={{ x: animateValues.x, y: animateValues.y }}
      onAnimationComplete={changeArmyPostionOnMap}
    >
      <div
        style={{
          backgroundColor: "#000",
          color: "#fff",
          position: "absolute",
          marginTop: "-20px",
        }}
      >
        {JSON.stringify(animateValues.x)}
      </div>
      <div
        style={{
          background: `linear-gradient(to right, red ${currentLife}, black ${currentLife})`,
        }}
        className="life-bar"
      ></div>
    </motion.div>
  );
};
