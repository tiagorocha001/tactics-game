import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { generateMap } from "../data/cenario/sampleBoard";
// Types
import { Turn } from "../data/types";
// Initial state
import { initialArmyState } from "../data/initialArmyState";
import { initialBaseState } from "../data/initialBaseState";
// Components
import { Map } from "./Map";
import { Header } from "./layout/Header";
import { DrawerArmy } from "./layout/DrawerArmy";

export const Main = () => {
  // Prevent page refresh *** uncomment latter
  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  const { finalMap, armyPositions, basePositions } = generateMap();

  // Map
  const [map, setMap] = useState(finalMap);

  // Turns
  const [turn, setTurn] = useState<Turn>("move");

  // Armies
  const [armies, setArmies] = useState(initialArmyState(armyPositions));

  // Bases
  const [bases, ] = useState(initialBaseState(basePositions));

  // console.log(map);
  // console.log("armies", armies);
  // console.log(armyPositions);

  // Drawer menu
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <button onClick={open}>Army List</button>
      <Header turn={turn} setTurn={setTurn} />
      <Map map={map} setMap={setMap} armies={armies} setArmies={setArmies} bases={bases} />
      <DrawerArmy opened={opened} close={close} armies={armies} />
    </>
  );
};
