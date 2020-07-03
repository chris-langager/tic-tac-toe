const WIDTH = 3;
const HEIGHT = 3;

// --- state ---

export interface State {
  activePlayer: Player;
  board: Board;
  phase: 'playing' | 'won' | 'cat';
  turn: string;
}

export type Board = Square[][];

export interface Square {
  state: 'empty' | Player;
  winning: boolean;
}

export type Player = 'Player 1' | 'Player 2';

// --- actions ---

export interface SquareClicked {
  type: 'SquareClicked';
  x: number;
  y: number;
}

export interface NewGameStarted {
  type: 'NewGameStarted';
}

export type Action = SquareClicked | NewGameStarted;

// --- reducer ---
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SquareClicked':
      return squareClicked(state, action);
    case 'NewGameStarted':
      return getNewGameState();
    default:
      return state;
  }
}

function squareClicked(state: State, action: SquareClicked): State {
  const { board, activePlayer, phase } = state;
  const { x, y } = action;
  const square = board[y][x];

  //if the game is over, clicking on a square should do nothing
  if (phase !== 'playing') {
    return state;
  }

  //if a player has already claimed a square, clicking on it should do nothing
  if (square.state !== 'empty') {
    return state;
  }

  const updatedBoard = board.map((row, columnIndex) =>
    row.map((boardSquare, rowIndex) => {
      if (x !== rowIndex || y !== columnIndex) {
        return boardSquare;
      }

      return {
        ...boardSquare,
        state: activePlayer,
      };
    })
  );

  //check for a winner.  if we find one, our game is over
  const winner = getWinner(updatedBoard);
  if (winner) {
    return {
      ...state,
      board: updatedBoard,
      phase: 'won',
    };
  }

  //check to see if all of the spaces are claimed.  if so, the game is over
  if (allSpacesClaimed(updatedBoard)) {
    return {
      ...state,
      board: updatedBoard,
      phase: 'cat',
    };
  }

  //looks like we don't have a winner yet, go to the next players turn
  return {
    ...state,
    board: updatedBoard,
    activePlayer: activePlayer === 'Player 1' ? 'Player 2' : 'Player 1',
  };
}

// --- game helper functions ---

export function getNewGameState(): State {
  const activePlayer = getRandomPlayer();
  const board = getNewBoard();
  return {
    activePlayer,
    board,
    phase: 'playing',
    turn: '',
  };
}

function getRandomPlayer(): Player {
  return Math.random() > 0.5 ? 'Player 1' : 'Player 2';
}

function getNewBoard(): Board {
  const board: Square[][] = [];

  for (let y = 0; y < HEIGHT; y++) {
    board[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      board[y].push({
        state: 'empty',
        winning: false,
      });
    }
  }

  return board;
}

function getWinner(board: Board): Player | null {
  //check for rows
  for (let y = 0; y < HEIGHT; y++) {
    const p1 = board[y].filter(({ state }) => state === 'Player 1');
    const p2 = board[y].filter(({ state }) => state === 'Player 2');

    if (p1.length === WIDTH) {
      return 'Player 1';
    }
    if (p2.length === WIDTH) {
      return 'Player 2';
    }
  }

  for (let x = 0; x < WIDTH; x++) {
    const column = getColumn(board, x);

    const p1 = column.filter(({ state }) => state === 'Player 1');
    const p2 = column.filter(({ state }) => state === 'Player 2');

    if (p1.length === HEIGHT) {
      return 'Player 1';
    }
    if (p2.length === HEIGHT) {
      return 'Player 2';
    }
  }

  return null;
}

function getColumn(board: Board, x: number) {
  const ret = [];
  for (let y = 0; y < HEIGHT; y++) {
    ret.push(board[y][x]);
  }
  return ret;
}

function allSpacesClaimed(board: Board): boolean {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (board[y][x].state === 'empty') {
        return false;
      }
    }
  }
  return true;
}
