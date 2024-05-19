import { Dispatch, SetStateAction, MouseEvent } from "react";
import { ArmyPropsWithoutSelect, ArmySelect } from "../Army";
import { PathActive } from ".";
import { GridItem } from "../../data/types";
import { COREVALUES } from "../../data/consts";

interface Props {
  rangeMap: GridItem[];
  map: GridItem[];
  setMap: Dispatch<SetStateAction<GridItem[]>>;
  armySelect: ArmySelect;
  setArmySelect: Dispatch<SetStateAction<ArmySelect>>;
  setPathActive: Dispatch<SetStateAction<PathActive>>;
  setPath: Dispatch<SetStateAction<PathActive[]>>;
  path: PathActive[];
  armies: ArmyPropsWithoutSelect[][];
  setArmies: Dispatch<SetStateAction<ArmyPropsWithoutSelect[][]>>;
  setPathFinal: Dispatch<SetStateAction<PathActive[]>>;
}

export const MapRange = ({
  rangeMap,
  map,
  setMap,
  armySelect,
  setArmySelect,
  setPathActive,
  setPath,
  path,
  armies,
  setArmies,
  setPathFinal,
}: Props) => {
  // Context menu - mouse right click
  const handleContextMenuRange = (event: { preventDefault: () => void }) => {
    event.preventDefault(); // Disable the default right-click behavior
    setArmySelect({
      y: 0,
      x: 0,
      active: false,
      copy: null,
    });
    setPath([]);
  };

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
      const newMap = [...map];
      const pathLast = path[path.length - 1];
      const pathFirst = path[0];
      const currentIndex = newMap.findIndex(
        (item) => item.y === pathLast.y && item.x === pathLast.x
      );
      const newIndex = newMap.findIndex(
        (item) => item.y === pathFirst.y && item.x === pathFirst.x
      );
      const armyId = newMap[currentIndex].army;
      // This will trigger the army to move from position A to B
      // newMap[newIndex].army = armyId;
      // newMap[currentIndex].army = "";
      setMap(newMap);
      setPathActive({ y: null, x: null });
      setArmySelect({
        y: 0,
        x: 0,
        active: false,
        copy: null,
      });

      // Update army list
      const newArmyList = [...armies];
      for (const subList of newArmyList) {
        for (const item of subList) {
          if (item.id === armyId) {
            item.x = x;
            item.y = y;
            return;
          }
        }
      }
      setArmies([...newArmyList]);
    }
  };

  return (
    <div className="grid-container-over-a">
      <div className="range-map">
        {rangeMap.map((cell) => {
          return (
            <div
              key={cell.id + "range"}
              className="grid-item"
              data-y={cell.y}
              data-x={cell.x}
              onClick={() => { 
                activateMovement(cell.y, cell.x);
                setPathFinal(path);
              }}
              onMouseOver={(e) =>
                activatePath(
                  !!armySelect.copy &&
                    cell.rangeValue > 0 &&
                    cell.rangeValue <=
                      armySelect.copy.rank + COREVALUES.player.rangeIncrement,
                  e
                )
              }
              onContextMenu={handleContextMenuRange}
            >
              <div
                className={
                  armySelect.copy &&
                  cell.rangeValue <=
                    armySelect.copy.rank + COREVALUES.player.rangeIncrement
                    ? "range-block"
                    : ""
                }
              >
                <div className={cell.pathActive ? "path" : ""}>
                  {cell.rangeValue}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
