import { useState } from 'react';
import { generateMap } from '../data/cenario/sampleBoard';
// Types
import { Action, Turn, type UnitProps } from '../data/types';
// Initial state
import { initialArmyState } from '../data/initialArmyState';
import { initialBaseState } from '../data/initialBaseState';
// Components
import { Map } from './Map';
import { Header } from './layout/Header';
import { UnitMenu } from './UnitMenu';
// Hooks
import { useContextMenu } from '../hooks/useContextMenu';
// import { usePreventPageReload } from '../hooks/usePreventPageReload';

export const Main = () => {
  const { finalMap, armyPositions, basePositions } = generateMap();

  // Map
  const [map, setMap] = useState(finalMap);

  // Actions
  const [action, setAction] = useState<Action>(Action.close);

  // Turns
  const [turn, setTurn] = useState<Turn>(Turn.player);

  // Armies
  const [armies, setArmies] = useState(initialArmyState(armyPositions));

  // Current army selected data
  const [unitSelected, setUnitSelected] = useState<UnitProps | null>(null);

  // Bases
  const [bases] = useState(initialBaseState(basePositions));

  // console.log(map);
  // console.log('armies', armies);
  // console.log(armyPositions);

  // Menu Army
  const [openedArmyMenu, setOpenedArmyMenu] = useState(false);

  // Hooks
  useContextMenu(setUnitSelected); // Disable right click context menu
  // usePreventPageReload() // Prevent page refresh *** uncomment latter

  return (
    <div className='main'>
      baseSelect: {JSON.stringify(unitSelected)}
      <button onClick={() => setOpenedArmyMenu(!openedArmyMenu)}>Army List</button>
      <Header turn={turn} setTurn={setTurn} />
      <UnitMenu action={action} setAction={setAction} armySelect={unitSelected} armies={armies} />
      <Map
        map={map}
        setMap={setMap}
        armies={armies}
        setArmies={setArmies}
        unitSelected={unitSelected}
        setUnitSelected={setUnitSelected}
        bases={bases}
        action={action}
        setAction={setAction}
      />
    </div>
  );
};
