import { convertToPercentage } from "../../utils";
import { UnitProps } from "../../data/types";
import styles from "./styles.module.css";

interface Props extends UnitProps {
  setBaseSelect: ({ y, x }: { y: number; x: number; active: boolean }) => void;
}

export const Base = ({ faction, type, life, lifeRef }: Props) => {
  const currentLife = convertToPercentage(lifeRef, life);
  return (
    <div className={`unit ${styles.base} ${styles[`base-${faction}-${type}`]}`}>
      <div
        style={{
          background: `linear-gradient(to right, red ${currentLife}, black ${currentLife})`,
        }}
        className="life-bar"
      ></div>
    </div>
  );
};
