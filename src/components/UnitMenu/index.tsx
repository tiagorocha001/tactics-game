import { useRef, Dispatch, SetStateAction } from 'react';
import { Action, UnitProps } from '../../data/types';
import { ArmyList } from './ArmyList';
import { OptionsList } from './OptionsList';
import { useClickOutside } from '../../hooks/useClickOutside';

interface Props {
  action: Action;
  setAction: Dispatch<SetStateAction<Action>>;
  armySelect: UnitProps | null;
  armies: UnitProps[][];
}

export const UnitMenu = ({ action, setAction, armySelect, armies }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => {
    setAction(Action.none);
  });
  return (
    <>
      {action === Action.openedMenu && <OptionsList ref={ref} armySelect={armySelect} setAction={setAction} />}
      {action === Action.armyList && <ArmyList ref={ref} armies={armies} />}
    </>
  );
};
