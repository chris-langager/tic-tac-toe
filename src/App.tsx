import React, { useReducer, Dispatch, Context, createContext, useCallback } from 'react';
import './App.css';
import { reducer, getNewGameState, Action } from './reducer';
import { Board } from './Board';

export const DispatchContext: Context<Dispatch<Action>> = createContext(
  (() => null) as React.Dispatch<Action>
);

export const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, getNewGameState());
  const newGameClicked = useCallback(() => {
    dispatch({ type: 'NewGameStarted' });
  }, []);

  const classNames = ['game'];
  if (state.phase === 'cat') {
    classNames.push('cat');
  }

  return (
    <div className={classNames.join(' ')}>
      <DispatchContext.Provider value={dispatch}>
        <div>{state.turn}</div>

        {state.phase === 'playing' && <div>It's {state.activePlayer}'s turn</div>}

        {state.phase === 'won' && <div>{state.activePlayer} won!</div>}

        {state.phase === 'cat' && <div>nobody wins =(</div>}

        <button onClick={newGameClicked}>New Game</button>

        <Board board={state.board} />
      </DispatchContext.Provider>
    </div>
  );
};
