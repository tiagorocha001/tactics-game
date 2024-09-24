import { Turn } from '../../data/types';

export interface Props {
  turn: string;
  setTurn: (turn: Turn) => void;
}

export const Header = ({
  turn,
  setTurn,
}: Props) => {
  return (
      <div className="header">
      <div className="turn">
        {turn}
      </div>
      <div className="turn-menu">
        <button onClick={() => setTurn(Turn.enemy)}>End Turn</button>
      </div>
    </div>
  );
};
