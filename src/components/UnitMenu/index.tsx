import { Dispatch, SetStateAction } from 'react';
import { Action, UnitProps } from '../../data/types';
import { ArmyList } from './ArmyList';
import { OptionsList } from './OptionsList';

interface Props {
  action: Action;
  setAction: Dispatch<SetStateAction<Action>>;
  armySelect: UnitProps | null;
  armies: UnitProps[][];
}

export const UnitMenu = ({ action, setAction, armySelect, armies }: Props) => {
  useClickOutside(ref, () => {
    setAction(Action.none);
  });
  return (
    <>
      {action === Action.openedMenu && <OptionsList armySelect={armySelect} setAction={setAction} />}
      {action === Action.armyList && <ArmyList armies={armies} />}
    </>
  );
};
