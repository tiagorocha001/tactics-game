import { type UnitProps } from '../../data/types';
import styles from './styles.module.css';
import armyStyles from '../Army/styles.module.css';

export interface Props {
  opened: boolean;
  close: () => void;
  armies: UnitProps[][];
}

export const MenuArmy = ({ opened, armies }: Props) => {
  return (
    <div className={styles[`army-drawer${opened ? '' : '-hidden'}`]}>
      <div className={styles['army-drawer-list']}>
        <div style={{ height: '50px', width: '50px' }}></div>
        <div>race</div>
        <div>life</div>
        <div>type</div>
        <div>pos y/x</div>
      </div>
      {armies[0].length > 0 &&
        armies[0].map((item, index) => {
          return (
            <div className={styles['army-drawer-list']} key={`army-list-${index}`}>
              <div
                className={`unit ${armyStyles[`army-${item.race}-${item.type}`]}`}
                style={{ height: '50px', width: '50px' }}
              ></div>
              <div>{item.race}</div>
              <div>{item.life}</div>
              <div>{item.type}</div>
              <div>{item.y}/{item.x}</div>
            </div>
          );
        })}
    </div>
  );
};
