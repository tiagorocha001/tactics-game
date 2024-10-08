import { useRef } from 'react';
import { Action, UnitProps } from '../../data/types';
import { Armies } from './Armies';
import { Options } from './Options';
import { Stats } from './Stats';
import { Items } from './Items';
import { useClickOutside } from '../../hooks/useClickOutside';

interface Props {
  action: Action;
  setAction: (action: Action) => void;
  armySelect: UnitProps | null;
  armies: UnitProps[][];
}

export const UnitMenu = ({ action, setAction, armySelect, armies }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => {
    setAction(Action.close);
  });
  return (
    <>
      {action === Action.openedMenu && <Options ref={ref} armySelect={armySelect} setAction={setAction} />}
      {action === Action.stats && <Stats ref={ref} armySelect={armySelect} />}
      {action === Action.armyList && <Armies ref={ref} armies={armies} />}
      {action === Action.item && <Items ref={ref} armySelect={armySelect} />}
    </>
  );
};
