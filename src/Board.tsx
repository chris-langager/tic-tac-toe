import React from "react";
import "./App.css";
import { Board as BoardData } from "./reducer";
import { Square } from "./Square";

export interface Props {
  board: BoardData;
}

export const Board: React.FC<Props> = ({ board }) => {
  return (
    <div className="board">
      {board.map((row, x) =>
        row.map((square, y) => (
          <Square key={`${x},${y}`} x={x} y={y} square={square} />
        ))
      )}
    </div>
  );
};
