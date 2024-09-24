import { useEffect } from 'react';
import { UnitProps } from '../data/types';

export const useContextMenu = (setArmySelect: (unitSelected: UnitProps | null) => void) => {
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