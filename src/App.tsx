import React, { useReducer, Dispatch, Context, createContext } from "react";
import "./App.css";
import { reducer, getNewGameState, Action } from "./reducer";
import { Board } from "./Board";

export const DispatchContext: Context<Dispatch<Action>> = createContext(
  (() => null) as React.Dispatch<Action>
);

export const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, getNewGameState());
  return (
    <div className="game">
      <DispatchContext.Provider value={dispatch}>
        <div>{state.turn}</div>
        <div>It's {state.activePlayer}'s turn!</div>
        <Board board={state.board} />
      </DispatchContext.Provider>
    </div>
  );
};
