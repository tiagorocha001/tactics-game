import { useState, useMemo } from 'react';
import { COREVALUES } from '../../data/consts';
import type { GridItem, ArmyProps } from '../../data/types';
import { calculateDistance } from '../../utils';
import { Army } from '../Army';
import { Base } from '../Base';
import type { BaseProps } from '../../data/types';
import { MapRange } from './MapRange';
import { Action } from '../../data/types';
import styles from './styles.module.css';

interface Props {
  map: GridItem[];
  setMap: (map: GridItem[]) => void;
  armies: ArmyProps[][];
  setArmies: (armies: ArmyProps[][]) => void;
  unitSelected: BaseProps | ArmyProps | null;
  setUnitSelected: (unitSelected: BaseProps | ArmyProps | null) => void;
  bases: BaseProps[][];
  action: Action;
  setAction: (action: Action) => void;
}

export interface PathActive {
  y: number | null;
  x: number | null;
}

export const Map = ({
  map,
  setMap,
  armies,
  setArmies,
  bases,
  unitSelected,
  setUnitSelected,
  action,
  setAction,
}: Props) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Active path
  const [pathActive, setPathActive] = useState<PathActive>({
    y: null,
    x: null,
  });

  // Path data
  const [path, setPath] = useState<PathActive[]>([]);
  const [pathFinal, setPathFinal] = useState<PathActive[]>([]);

  // Previous and new map index for army ID placement
  const [armyLocationIdIndex, setArmyLocationIdIndex] = useState<{
    currentIndex: number | null;
    newIndex: number | null;
  }>({
    currentIndex: null,
    newIndex: null,
  });

  // Place army
  const findObjectById = (id: string, arrayOfArrays: (BaseProps | ArmyProps)[][]) => {
    for (const arr of arrayOfArrays) {
      const foundObject = arr.find((obj) => obj.id === id);
      if (foundObject && foundObject.life > 0) {
        return foundObject;
      }
    }
  };

  const placeArmy = (id: string, index: number) => {
    const data = findObjectById(id, armies);
    if (!data) {
      return null;
    }
    return (
      <Army
        {...data as ArmyProps}
        key={id}
        index={index}
        setUnitSelected={setUnitSelected}
        setMap={setMap}
        map={map}
        unitSelected={unitSelected}
        pathFinal={pathFinal}
        armyLocationIdIndex={armyLocationIdIndex}
        setArmyLocationIdIndex={setArmyLocationIdIndex}
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        setAction={setAction}
      />
    );
  };

  const placeBase = (id: string, index: number) => {
    const data = findObjectById(id, bases);
    if (!data) { 
      return null;
    }
    return (
      <Base
        {...data as BaseProps}
        key={id}
        index={index}
        setUnitSelected={setUnitSelected}
        setAction={setAction}
      />
    );
  };

  // -------------------------
  // Range map data
  // -------------------------
  const rangeMap = useMemo(() => {
    const gridPoints = () => {
      const grid = structuredClone(map);
      const stack = [];

      if (!unitSelected) return;

      stack.push(unitSelected.index);
      // Mark player position as already checked
      grid[unitSelected.index].rangeCheck = true;

      // Feed grid with positions costs
      for (let i = 0; i < grid.length; i++) {
        grid[i].rangeCheck = true;
        const distance = calculateDistance(
          unitSelected.x,
          unitSelected.y,
          grid[i].x,
          grid[i].y
        );
        let terrainCost = 0;

        // Terrain cost set
        if (
          (grid[i].terrain === 'F' || grid[i].terrain === 'M') && // TODO: add enum
          unitSelected.index !== i
        ) {
          terrainCost = 1;
        } else if (unitSelected.index !== i && grid[i].terrain === 'W') {
          terrainCost = 2;
        }

        // Unit/Base cost set
        if (unitSelected.index !== i && grid[i].army.length) {
          terrainCost = 99;
        }
        if (grid[i].base.length) {
          terrainCost = 99;
        }

        grid[i].rangeValue = distance + terrainCost + distance * terrainCost;
      }

      // Convert array in order to make easy transform its values
      const newArray = [];
      const size = COREVALUES.combatMap.size;
      for (let i = 0; i < grid.length; i += size) {
        newArray.push(grid.slice(i, i + size));
      }

      // Loop over grid to correct terrains values affected by mountains, water and forest
      let wrongValues = true;
      let loopErrorBlocker = 0;
      while (wrongValues && loopErrorBlocker < 10_000) {
        loopErrorBlocker++;
        bothLoops: for (let y = 0; y < newArray.length; y++) {
          for (let x = 0; x < newArray[y].length; x++) {
            if (
              (y > 0 &&
                newArray[y - 1][x].rangeValue < newArray[y][x].rangeValue) ||
              (x > 0 &&
                newArray[y][x - 1].rangeValue < newArray[y][x].rangeValue) ||
              (x < newArray[y].length - 1 &&
                newArray[y][x + 1].rangeValue < newArray[y][x].rangeValue) ||
              (y < newArray.length - 1 &&
                newArray[y + 1][x].rangeValue < newArray[y][x].rangeValue)
            ) {
              wrongValues = false;
            } else if (newArray[y][x].rangeValue > 0) {
              wrongValues = true;
              newArray[y][x].rangeValue++;
              break bothLoops;
            }
          }
        }
      }

      // Path active
      if (pathActive.x !== null && pathActive.y !== null) {
        // Reset path Active
        for (let y = 0; y < newArray.length; y++) {
          for (let x = 0; x < newArray[y].length; x++) {
            newArray[y][x].pathActive = false;
          }
        }

        setPath([]);

        let loopErrorBlocker = 0;
        let rangeValue = newArray[pathActive.y][pathActive.x].rangeValue;
        let currentX = pathActive.x;
        let currentY = pathActive.y;
        newArray[pathActive.y][pathActive.x].pathActive = true;

        while (rangeValue >= 1 && loopErrorBlocker < 10_000) {
          loopErrorBlocker++;
          const smallerRange = [];
          for (let y = 0; y < newArray.length; y++) {
            for (let x = 0; x < newArray[y].length; x++) {
              if (
                calculateDistance(
                  newArray[y][x].x,
                  newArray[y][x].y,
                  currentX,
                  currentY
                ) === 1 &&
                newArray[y][x].rangeValue < rangeValue &&
                !newArray[y][x].pathActive
              ) {
                smallerRange.push({
                  y,
                  x,
                  rangeValue: newArray[y][x].rangeValue,
                });
              }
            }
          }
          // Ensure that the smaller rangeValue is taken
          const sortedArray = smallerRange.sort(
            (a, b) => a.rangeValue - b.rangeValue
          );
          currentY = sortedArray[0].y;
          currentX = sortedArray[0].x;
          rangeValue = sortedArray[0].rangeValue;
          newArray[sortedArray[0].y][sortedArray[0].x].pathActive = true;
          setPath((prev) => [
            ...prev,
            { y: sortedArray[0].y, x: sortedArray[0].x },
          ]);
        }
        setPath((prev) => [pathActive, ...prev]);
      }

      return newArray.flat(2);
    };
    return gridPoints() || [];
  }, [unitSelected, map, pathActive]);
  // -------------------------
  // -------------------------

  console.log('armySelect: ', unitSelected);

  return (
    <div className={styles.mainContainer}>
      {/* Army range display */}
      {unitSelected && action === Action.move && (
        <MapRange
          rangeMap={rangeMap}
          map={map}
          unitSelected={unitSelected}
          path={path}
          armies={armies}
          setMap={setMap}
          setUnitSelected={setUnitSelected}
          setPathActive={setPathActive}
          setArmies={setArmies}
          setPathFinal={setPathFinal}
          setArmyLocationIdIndex={setArmyLocationIdIndex}
          setIsAnimating={setIsAnimating}
        />
      )}
      {/* Main map */}
      <div className="grid-container">
        {map.length > 0 &&
          map.map((cell: GridItem, index) => (
            <div
              key={cell.id}
              id={cell.id}
              className={`grid-item type-${cell.terrain}`}
            >
              {/* Army render */}
              {!!cell.army && placeArmy(cell.army, index)}
              {/* Base render */}
              {!!cell.base && placeBase(cell.base, index)}
            </div>
          ))}
      </div>
    </div>
  );
};
