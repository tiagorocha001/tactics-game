import { useState } from 'react';
import { generateMap } from '../data/cenario/sampleBoard';
// Types
import {
  Action,
  Turn,
  type BaseProps,
  type GridItem,
  type ArmyProps,
} from '../data/types';
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

interface GameState {
  map: GridItem[];
  action: Action;
  turn: Turn;
  armies: ArmyProps[][];
  unitSelected: BaseProps | ArmyProps | null;
  bases: BaseProps[][];
  openedArmyMenu: boolean;
}

export const Main = () => {
  const { finalMap, armyPositions, basePositions } = generateMap();

  // Initialize all state in a single object
  const [gameState, setGameState] = useState<GameState>({
    map: finalMap,
    action: Action.close,
    turn: Turn.player,
    armies: initialArmyState(armyPositions),
    unitSelected: null,
    bases: initialBaseState(basePositions),
    openedArmyMenu: false,
  });

  // Helper function to update specific properties of the state
  const updateGameState = (updates: Partial<GameState>) =>
    setGameState((prevState) => ({ ...prevState, ...updates }));

  // Specific update functions
  const setMap = (map: GridItem[]) => updateGameState({ map });

  const setAction = (action: Action) => updateGameState({ action });

  const setTurn = (turn: Turn) => updateGameState({ turn });

  const setArmies = (armies: ArmyProps[][]) => updateGameState({ armies });

  const setUnitSelected = (unitSelected: BaseProps | ArmyProps | null) =>
    updateGameState({ unitSelected });

  console.log('gameState', gameState);

  // Hooks
  useContextMenu(setUnitSelected); // Disable right click context menu
  // usePreventPageReload() // Prevent page refresh *** uncomment latter

  return (
    <div className="main">
      {gameState.action === Action.openedMenu ||
      gameState.action === Action.stats ? (
        <div className="overlay visible"></div>
      ) : (
        <div className="overlay"></div>
      )}
      <Header turn={gameState.turn} setTurn={setTurn} />
      <UnitMenu
        action={gameState.action}
        setAction={setAction}
        armySelect={gameState.unitSelected}
        armies={gameState.armies}
        setArmies={setArmies}
      />
      <Map
        map={gameState.map}
        setMap={setMap}
        armies={gameState.armies}
        setArmies={setArmies}
        unitSelected={gameState.unitSelected}
        setUnitSelected={setUnitSelected}
        bases={gameState.bases}
        action={gameState.action}
        setAction={setAction}
      />
    </div>
  );
};
