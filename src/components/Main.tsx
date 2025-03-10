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

  const gameStateAction = {
    setMap: (map : GridItem[]) => setGameState((prev) => ({ ...prev, map })),
    setAction: (action : Action) => setGameState((prev) => ({ ...prev, action })),
    setTurn: (turn: Turn) => setGameState((prev) => ({ ...prev, turn })),
    setArmies: (armies: ArmyProps[][]) => setGameState((prev) => ({ ...prev, armies })),
    setUnitSelected: (unitSelected: BaseProps | ArmyProps | null) => setGameState((prev) => ({ ...prev, unitSelected })),
  }

  // Specific update functions

  console.log('gameState', gameState);

  // Hooks
  useContextMenu(gameStateAction.setUnitSelected); // Disable right click context menu
  // usePreventPageReload() // Prevent page refresh *** uncomment latter

  return (
    <div className="main">
      {gameState.action === Action.openedMenu ||
      gameState.action === Action.stats ? (
        <div className="overlay visible"></div>
      ) : (
        <div className="overlay"></div>
      )}
      <Header turn={gameState.turn} setTurn={gameStateAction.setTurn} />
      <UnitMenu
        action={gameState.action}
        setAction={gameStateAction.setAction}
        armySelect={gameState.unitSelected}
        armies={gameState.armies}
        setArmies={gameStateAction.setArmies}
      />
      <Map
        map={gameState.map}
        setMap={gameStateAction.setMap}
        armies={gameState.armies}
        setArmies={gameStateAction.setArmies}
        unitSelected={gameState.unitSelected}
        setUnitSelected={gameStateAction.setUnitSelected}
        bases={gameState.bases}
        action={gameState.action}
        setAction={gameStateAction.setAction}
      />
    </div>
  );
};
