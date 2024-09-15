import { useEffect, Dispatch, SetStateAction } from 'react';
import { UnitProps } from '../data/types';

export const useContextMenu = (setArmySelect: Dispatch<SetStateAction<UnitProps | null>>) => {
    useEffect(() => {
      const handleContextMenu = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setArmySelect(null);
      };
  
      document.addEventListener('contextmenu', handleContextMenu);
  
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }, [setArmySelect]);
  };