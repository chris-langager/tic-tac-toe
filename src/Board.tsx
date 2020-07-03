import React from 'react';
import './App.css';
import { Board as BoardData } from './reducer';
import { Square } from './Square';

export interface Props {
  board: BoardData;
}

export const Board: React.FC<Props> = ({ board }) => {
  return (
    <div className="board">
      {board.map((square) => (
        <Square key={`${square.x},${square.y}`} square={square} />
      ))}
    </div>
  );
};
