const WIDTH = 3;
const HEIGHT = 3;

// --- state ---

export interface State {
  activePlayer: Player;
  board: Board;
  phase: "playing" | "won" | "cat";
  turn: string;
}

export type Board = Square[][];

export interface Square {
  state: "empty" | Player;
  winning: boolean;
}

export type Player = "Player 1" | "Player 2";

// --- actions ---

export interface SquareClicked {
  type: "SquareClicked";
  x: number;
  y: number;
}

export interface NewGameStarted {
  type: "NewGameStarted";
}

export type Action = SquareClicked | NewGameStarted;

// --- reducer ---
export function reducer(state: State, action: Action): State {
  console.log(action);
  return state;
}

// --- game helper functions ---

export function getNewGameState(): State {
  const activePlayer = getRandomPlayer();
  const board = getNewBoard();
  return {
    activePlayer,
    board,
    phase: "playing",
    turn: "",
  };
}

function getRandomPlayer(): Player {
  return Math.random() > 0.5 ? "Player 1" : "Player 2";
}

function getNewBoard(): Board {
  const board: Square[][] = [];

  for (let x = 0; x < WIDTH; x++) {
    board[x] = [];
    for (let y = 0; y < HEIGHT; y++) {
      board[x].push({
        state: "empty",
        winning: false,
      });
    }
  }

  return board;
}
