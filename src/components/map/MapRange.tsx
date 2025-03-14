import type { Dispatch, SetStateAction, MouseEvent } from 'react';
import type { PathActive } from '.';
import type { GridItem } from '../../data/types';
import type { BaseProps, ArmyProps } from '../../data/types';

interface Props {
  rangeMap: GridItem[];
  map: GridItem[];
  setMap: (map: GridItem[]) => void;
  unitSelected: BaseProps | ArmyProps | null;
  setUnitSelected: (unitSelected: BaseProps | ArmyProps | null) => void;
  setPathActive: Dispatch<SetStateAction<PathActive>>;
  path: PathActive[];
  armies: ArmyProps[][];
  setArmies: (armies: ArmyProps[][]) => void;
  setPathFinal: Dispatch<SetStateAction<PathActive[]>>;
  setArmyLocationIdIndex: Dispatch<
    SetStateAction<{
      currentIndex: number | null;
      newIndex: number | null;
    }>
  >;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
}

export const MapRange = ({
  rangeMap,
  map,
  setMap,
  unitSelected,
  setUnitSelected,
  setPathActive,
  path,
  armies,
  setArmies,
  setPathFinal,
  setArmyLocationIdIndex,
  setIsAnimating,
}: Props) => {

  function activatePath(onRange: boolean, e: MouseEvent<HTMLDivElement>) {
    const { dataset } = e.currentTarget;
    const x = Number(dataset.x);
    const y = Number(dataset.y);
    if (onRange) {
      setPathActive({ y, x });
    } else {
      setPathActive({ y: null, x: null });
    }
  }

  const activateMovement = (y: number, x: number) => {
    const obj = { y, x };
    const match = path.some(
      (item) => JSON.stringify(item) === JSON.stringify(obj)
    );

    // Move army from old to new position
    if (match) {
      const newMap: GridItem[] = structuredClone(map);
      const pathLast = path[path.length - 1];
      const pathFirst = path[0];
      const currentIndex = newMap.findIndex(
        (item) => item.y === pathLast.y && item.x === pathLast.x
      );
      const newIndex = newMap.findIndex(
        (item) => item.y === pathFirst.y && item.x === pathFirst.x
      );
      const armyId = newMap[currentIndex].army;

      setArmyLocationIdIndex({ currentIndex, newIndex });
      setMap(newMap);
      setPathActive({ y: null, x: null });
      setUnitSelected(null);

      // Update army list
      const newArmyList = [...armies];
      for (const subList of newArmyList) {
        for (const item of subList) {
          if (item.id === armyId) {
            item.x = x;
            item.y = y;
            item.movePoints = item.movePoints && item.movePoints - path.length;
            return;
          }
        }
      }
      setArmies([...newArmyList]);
    }
  };

  return (
    <div className='grid-container-over-a'>
      <div className='range-map'>
        {rangeMap.map((cell) => {
          const isMoveableBlock =
          cell.rangeValue > 0 &&
          unitSelected &&
          unitSelected.movePoints !== undefined &&
          cell.rangeValue <= unitSelected.movePoints;
          return (
            <div
              key={cell.id + 'range'}
              className='grid-item'
              data-y={cell.y}
              data-x={cell.x}
              onClick={() => {
                if (isMoveableBlock){
                  activateMovement(cell.y, cell.x);
                  setPathFinal(path);
                  setIsAnimating(true);
                }
              }}
              onMouseOver={(e) => activatePath(isMoveableBlock as boolean, e)}
            >
              <div className={isMoveableBlock ? 'range-block' : 'not-range-block'}>
                <div className={cell.pathActive ? 'path' : ''}>
                  {/* {cell.rangeValue} */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
