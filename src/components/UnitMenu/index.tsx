import { useRef, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.css";
import { useClickOutside } from "../../hooks/useClickOutside";
import { type Turn } from "../../data/types";

interface Props {
  setMenu: Dispatch<SetStateAction<boolean>>;
  setTurn: Dispatch<SetStateAction<Turn>>;
}

interface MenuItems {
  name: Turn;
  id: string;
}

const menuItems: MenuItems[] = [
  { name: "move", id: "unitId-move" },
  { name: "attack", id: "unitId-attack" },
  { name: "item", id: "unitId-item" },
  { name: "rest", id: "unitId-rest" },
];

export const UnitMenu = ({ setMenu, setTurn }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  function clickOutside() {
    setMenu(false);
  }

  function clickInside(action: Turn) {
    setTurn(action);
    setMenu(false);
  }
  useClickOutside(ref, clickOutside);

  return (
    <motion.div
      ref={ref}
      className={styles.unitMenu}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {menuItems.map((item) => {
        return (
          <button id={item.id} onClick={() => clickInside(item.name)}>
            {item.name}
          </button>
        );
      })}
    </motion.div>
  );
};
