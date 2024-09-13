import { useEffect, Dispatch, SetStateAction } from "react";
import { type ArmySelect } from "../components/Army";

export const useContextMenu = (setArmySelect: Dispatch<SetStateAction<ArmySelect>>) => {
    useEffect(() => {
      const handleContextMenu = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setArmySelect({
          y: 0,
          x: 0,
          active: false,
          copy: null,
        });
      };
  
      document.addEventListener('contextmenu', handleContextMenu);
  
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }, [setArmySelect]);
  };