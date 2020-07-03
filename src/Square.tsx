import React, { useContext, useCallback } from 'react';
import { Square as SquareData, SIZE } from './reducer';
import { DispatchContext } from './App';

export interface Props {
  square: SquareData;
}

export const Square: React.FC<Props> = ({ square }) => {
  const dispatch = useContext(DispatchContext);

  const onClick = useCallback(() => {
    dispatch({
      type: 'SquareClicked',
      square,
    });
  }, [dispatch, square]);

  const { x, y, winning, state } = square;

  const classNames = ['square'];
  if (x === 0) {
    classNames.push('left');
  }
  if (x === SIZE - 1) {
    classNames.push('right');
  }
  if (y === 0) {
    classNames.push('top');
  }
  if (y === SIZE - 1) {
    classNames.push('bottom');
  }

  if (winning) {
    classNames.push('winning');
  }

  const content = state === 'Player 1' ? 'X' : state === 'Player 2' ? 'O' : '';

  return (
    <div className={classNames.join(' ')} onClick={onClick}>
      {content}
      {/* <p>{`(${x}, ${y})`}</p>
      <p>{JSON.stringify(square.winning)}</p>
      <p>{square.state}</p> */}
    </div>
  );
};
