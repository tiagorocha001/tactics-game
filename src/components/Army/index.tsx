/* eslint-disable react-hooks/exhaustive-deps */
import { convertToPercentage } from "../../utils";
import { ArmyType } from "../../data/types";
import { useEffect, Dispatch, SetStateAction, useState } from "react";
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
  pathFinal: PathActive[];
  armySelect: ArmySelect;
  armies: ArmyPropsWithoutSelect[][];
}

export type ArmyPropsWithoutSelect = Omit<
  Props,
  "setArmySelect" | "isMoveActive" | "pathFinal" | "armySelect" | "armies"
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
  armies,
}: Props) => {
  const [active, setActive] = useState(false);
  // Animation
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

  useEffect(() => {
    if (armySelect?.copy?.id === id) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [armySelect, id]);

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

    active && setAnimateValues({ x: xList, y: yList });
  }

  useEffect(() => {
    if (pathFinal.length > 0) {
      generateAnimationData(pathFinal);
    }
  }, [pathFinal.length]);

  return (
    <motion.div
      className={`unit ${styles.army} ${styles[`army-${race}-${type}`]}`}
      onClick={() => handleArmySelection()}
      id={`${type}-${y}-${x}`}
      // animate={{ x: [0, 54, 54, 54], y: [0, 0, 54, 108] }}
      animate={{ x: animateValues.x, y: animateValues.y }}
      transition={{
      }}
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
