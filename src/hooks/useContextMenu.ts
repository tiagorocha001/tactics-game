import { useEffect } from 'react';
import { type BaseProps, type ArmyProps } from '../data/types';

export const useContextMenu = (setArmySelect: (unitSelected: BaseProps | ArmyProps | null) => void) => {
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