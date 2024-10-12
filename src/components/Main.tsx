import { useState, useCallback } from 'react';
import { generateMap } from '../data/cenario/sampleBoard';
// Types
import { Action, Turn, type UnitProps, type GridItem } from '../data/types';
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
  armies: UnitProps[][];
  unitSelected: UnitProps | null;
  bases: UnitProps[][];
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
  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prevState => ({ ...prevState, ...updates }));
  }, []);

  // Specific update functions
  const setMap = useCallback((map: GridItem[]) => updateGameState({ map }), [updateGameState]);
  const setAction = useCallback((action: Action) => updateGameState({ action }), [updateGameState]);
  const setTurn = useCallback((turn: Turn) => updateGameState({ turn }), [updateGameState]);
  const setArmies = useCallback((armies: UnitProps[][]) => updateGameState({ armies }), [updateGameState]);
  const setUnitSelected = useCallback((unitSelected: UnitProps | null) => updateGameState({ unitSelected }), [updateGameState]);

  console.log('gameState', gameState);

  // Hooks
  useContextMenu(setUnitSelected); // Disable right click context menu
  // usePreventPageReload() // Prevent page refresh *** uncomment latter

  return (
    <div className='main'>
      <Header turn={gameState.turn} setTurn={setTurn} />
      <UnitMenu action={gameState.action} setAction={setAction} armySelect={gameState.unitSelected} armies={gameState.armies} />
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
