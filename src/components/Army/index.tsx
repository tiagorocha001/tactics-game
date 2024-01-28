import { convertToPercentage } from "../../utils";
import { ArmyType } from "../../data/types";
import {
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { PathActive } from "../Map";
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
  isMoveActive: boolean;
  setMoveDirection: Dispatch<
    SetStateAction<"top" | "right" | "bottom" | "left" | "none">
  >;
  setArmySelect: Dispatch<
    SetStateAction<{
      y: number;
      x: number;
      active: boolean;
      copy: ArmyPropsWithoutSelect | null;
    }>
  >;
  armySelect: ArmySelect;
  path: PathActive[];
  moveDirection: "top" | "right" | "bottom" | "left" | "none";
  setIsMoveAnimationActive: Dispatch<SetStateAction<boolean>>;
}

export type ArmyPropsWithoutSelect = Omit<
  Props,
  | "setArmySelect"
  | "isMoveActive"
  | "path"
  | "moveDirection"
  | "setMoveDirection"
  | "setIsMoveAnimationActive"
  | "armySelect"
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
  setMoveDirection,
  isMoveActive,
  setArmySelect,
  armySelect,
  path,
  moveDirection,
  setIsMoveAnimationActive,
}: Props) => {
  const element = useRef<HTMLDivElement | null>(null);
  const [yAnimation, setYAnimation] = useState(0);
  const [xAnimation, setXAnimation] = useState(0);
  const [active, setActive] = useState(false);

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
    const moveDirectionHandler = () => {
      setIsMoveAnimationActive(false);
      setMoveDirection("none");
    };

    const el = element.current;

    if (el) {
      el?.addEventListener("transitionend", moveDirectionHandler);

      return () => {
        el.removeEventListener("transitionend", moveDirectionHandler);
      };
    }
  }, [setMoveDirection, setIsMoveAnimationActive]);

  useEffect(() => {
    if (active) {
      if (moveDirection === "top") {
        setYAnimation((prev) => prev - 54);
      }
      if (moveDirection === "right") {
        setXAnimation((prev) => prev + 54);
      }
      if (moveDirection === "bottom") {
        setYAnimation((prev) => prev + 54);
      }
      if (moveDirection === "left") {
        setXAnimation((prev) => prev - 54);
      }
    }
  }, [moveDirection, active]);

  useEffect(() => {
    if (armySelect?.copy?.id === id){
      setActive(true);
    } else {
      setActive(false);
    }
  }, [armySelect, id])

  // Handle direction
  const translateDirection = useMemo(() => {
    if (moveDirection === "top" || moveDirection === "bottom") {
      return `translateY(${yAnimation}px)`;
    }
    if (moveDirection === "right" || moveDirection === "left") {
      return `translateX(${xAnimation}px)`;
    }
  }, [yAnimation, xAnimation, moveDirection]);

  return (
    <div
      className={`unit ${styles.army} ${styles[`army-${race}-${type}`]}`}
      onClick={() => handleArmySelection()}
      id={`${type}-${y}-${x}`}
      ref={element}
      style={{ transform: active ? translateDirection : "" }}
    >
      {moveDirection} / {String(active)}
      <div
        style={{
          background: `linear-gradient(to right, red ${currentLife}, black ${currentLife})`,
        }}
        className="life-bar"
      ></div>
    </div>
  );
};
