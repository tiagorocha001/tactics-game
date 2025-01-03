import { useRef } from 'react';
import { Action, type BaseProps, type ArmyProps } from '../../data/types';
import { Armies } from './Armies';
import { Options } from './Options';
import { Stats } from './Stats';
import { Items } from './Items';
import { useClickOutside } from '../../hooks/useClickOutside';

interface Props {
  action: Action;
  setAction: (action: Action) => void;
  setArmies: (armies: ArmyProps[][]) => void;
  armySelect: BaseProps | ArmyProps | null;
  armies: ArmyProps[][];
}

export const UnitMenu = ({ action, setAction, armySelect, armies, setArmies }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => {
    setAction(Action.close);
  });
  return (
    <>
      {action === Action.openedMenu && <Options ref={ref} armySelect={armySelect} setAction={setAction} />}
      {action === Action.stats && <Stats ref={ref} armySelect={armySelect} />}
      {action === Action.armyList && <Armies ref={ref} armies={armies} />}
      {action === Action.item && <Items ref={ref} armies={armies} armySelect={armySelect as ArmyProps} setArmies={setArmies} />}
    </>
  );
};
