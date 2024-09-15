import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { generateMap } from '../data/cenario/sampleBoard';
// Types
import { Turn, type UnitProps } from '../data/types';
// Initial state
import { initialArmyState } from '../data/initialArmyState';
import { initialBaseState } from '../data/initialBaseState';
// Components
import { Map } from './Map';
import { Header } from './layout/Header';
import { DrawerArmy } from './layout/DrawerArmy';
import { UnitMenu } from './UnitMenu';
// Hooks
import { useContextMenu } from '../hooks/useContextMenu';
// import { usePreventPageReload } from '../hooks/usePreventPageReload';

export const Main = () => {
  const { finalMap, armyPositions, basePositions } = generateMap();

  // Map
  const [map, setMap] = useState(finalMap);

  // Turns
  const [turn, setTurn] = useState<Turn>(Turn.none);

  // Unit Menu
  const [menu, setMenu] = useState(false);

  // Armies
  const [armies, setArmies] = useState(initialArmyState(armyPositions));

  // Current army selected data
  const [armySelect, setArmySelect] = useState<UnitProps | null>(null);

  // Bases
  const [bases] = useState(initialBaseState(basePositions));

  // console.log(map);
  // console.log('armies', armies);
  // console.log(armyPositions);

  // Drawer menu
  const [opened, { open, close }] = useDisclosure(false);

  // Hooks
  useContextMenu(setArmySelect); // Disable right click context menu
  // usePreventPageReload() // Prevent page refresh *** uncomment latter

  return (
    <>
      menu: {String(menu)}
      <button onClick={open}>Army List</button>
      <Header turn={turn} setTurn={setTurn} />
      {menu && <UnitMenu setMenu={setMenu} setTurn={setTurn} armySelect={armySelect} />}
      <Map
        map={map}
        setMap={setMap}
        armies={armies}
        setArmies={setArmies}
        armySelect={armySelect}
        setArmySelect={setArmySelect}
        bases={bases}
        setMenu={setMenu}
        turn={turn}
        setTurn={setTurn}
      />
      <DrawerArmy opened={opened} close={close} armies={armies} />
    </>
  );
};
