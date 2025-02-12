import { generateWave } from './waveFunctionA';
import { COREVALUES } from '../consts';
// Types
import type { FinalCell } from './waveFunctionA';
import { type GridItem, UnitFaction } from '../types';
import type { InitialPosition } from '../initialArmyState';
// Utils
import { generateId } from '../../utils'

function gridItem(): GridItem {
  return {
    id: '',
    terrain: 'G',
    aboveTerrain: '',
    x: 0,
    y: 0,
    rangeCheck: false,
    rangeValue: 0,
    pathActive: false,
    army: '',
    base: ''
  };
}

// Main map
const map: GridItem[][] = [];

// Used for randomize player position
const basesPossibleTerrain: GridItem[] = [];

const waveData = generateWave();
const size = COREVALUES.combatMap.size;

// Exported first positions
let armyPositions: InitialPosition;
let basePositions: InitialPosition;

export function generateMap() {
  function feedMap() {
    for (let y = 0; y < size; y++) {
      map[y] = [];
      for (let x = 0; x < size; x++) {
        const newItem = gridItem();

        newItem.x = x;
        newItem.y = y;
        newItem.id = y + '-' + x;
        newItem.terrain = (waveData[y][x].final as FinalCell).type;
        map[y][x] = newItem;

        basesPossibleTerrain.push(newItem);
      }
    }
  }

  // Select player/enemy starting base
  function selectRandomValue() {
    const res =
      basesPossibleTerrain[
        Math.floor(Math.random() * basesPossibleTerrain.length)
      ];
    return { ...res };
  }

  function selectPlayersPosition() {
    const player = selectRandomValue();
    const enemy = selectRandomValue();

    // Conditional position of players base
    const xDistance = Math.abs(player.x - enemy.x) < 10;
    const yDistance = Math.abs(player.y - enemy.y) < 10;
    const playerPosition =
      player.x === 0 ||
      player.x === size - 1 ||
      player.y === 0 ||
      player.y === size - 1;
    const enemyPosition =
      enemy.x === 0 ||
      enemy.x === size - 1 ||
      enemy.y === 0 ||
      enemy.y === size - 1;
    if (xDistance || yDistance || playerPosition || enemyPosition) {
      selectPlayersPosition();
    } else {
      // Player
      map[player.y][player.x].base = generateId(UnitFaction.humanA, 0, 'human', 'city');

      // Enemy
      map[enemy.y][enemy.x].base = generateId(UnitFaction.orcA, 0, 'orc', 'city');

      // Set first army location
      armyFirstLocation({player, enemy});

      basePositions = {y0: player.y, x0: player.x, y1: enemy.y, x1: enemy.x};
    }
  }

  // Set first army location
  function armyFirstLocation(positions: {player: GridItem, enemy: GridItem}){
    console.log('positions: ', positions);
    const { player, enemy } = positions;
    console.log('map: ', map);
    // Player
    map[player.y][player.x+1].army = generateId(UnitFaction.humanA, 0, 'human', 'knight');
    map[1][1].army = generateId(UnitFaction.humanA, 1, 'human', 'knight');

    // Enemy
    map[enemy.y][enemy.x+1].army = generateId(UnitFaction.orcA, 0, 'orc', 'knight');

    armyPositions = {y0: player.y, x0: player.x+1, y1: enemy.y, x1: enemy.x+1};
  }

  if (map.length === 0) {
    feedMap();
    selectPlayersPosition();
  }

  const finalMap = map.flat(2);
  return { finalMap, armyPositions, basePositions };
}
