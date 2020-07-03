import React, { useContext, useCallback } from 'react';
import { Square as SquareData } from './reducer';
import { DispatchContext } from './App';

export interface Props {
  x: number;
  y: number;
  square: SquareData;
}

export const Square: React.FC<Props> = ({ x, y, square }) => {
  const dispatch = useContext(DispatchContext);

  const onClick = useCallback(() => {
    dispatch({
      type: 'SquareClicked',
      x,
      y,
    });
  }, [dispatch, x, y]);

  return (
    <div className="square" onClick={onClick}>
      {`(${x}, ${y})`}
      {JSON.stringify(square.state)}
    </div>
  );
};
