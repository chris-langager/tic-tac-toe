export const SIZE = 3;

// --- state ---

export interface State {
  activePlayer: Player;
  board: Board;
  phase: 'playing' | 'won' | 'cat';
  turn: string;
}

export type Board = Square[];

export interface Square {
  x: number;
  y: number;
  state: 'empty' | Player;
  winning: boolean;
}

export type Player = 'Player 1' | 'Player 2';

// --- actions ---

export interface SquareClicked {
  type: 'SquareClicked';
  square: Square;
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
  const { square: clickedSquare } = action;

  //if the game is over, clicking on a square should do nothing
  if (phase !== 'playing') {
    return state;
  }

  //if a player has already claimed a square, clicking on it should do nothing
  if (clickedSquare.state !== 'empty') {
    return state;
  }

  const updatedBoard = board.map((boardSquare) => {
    if (clickedSquare.x !== boardSquare.x || clickedSquare.y !== boardSquare.y) {
      return boardSquare;
    }
    return {
      ...boardSquare,
      state: activePlayer,
    };
  });

  //check for a winner.  if we find one, our game is over
  const winnerData = getWinnerData(updatedBoard);
  if (winnerData) {
    return {
      ...state,
      board: updatedBoard.map((square) => {
        const winningSquare = winnerData.winningSet.find(
          (winningSquare) => winningSquare.x === square.x && winningSquare.y === square.y
        );

        return {
          ...square,
          winning: !!winningSquare,
        };
      }),
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
  const board: Board = [];

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      board.push({
        x,
        y,
        state: 'empty',
        winning: false,
      });
    }
  }

  return board;
}

interface WinnerData {
  winner: Player;
  winningSet: Square[];
}
function getWinnerData(board: Board): WinnerData | null {
  for (let winningSet of getWinningSets(board)) {
    if (winningSet.filter((square) => square.state === 'Player 1').length === SIZE) {
      return {
        winner: 'Player 1',
        winningSet,
      };
    }

    if (winningSet.filter((square) => square.state === 'Player 2').length === SIZE) {
      return {
        winner: 'Player 2',
        winningSet,
      };
    }
  }

  return null;
}

function getWinningSets(board: Board) {
  const winningSets: Square[][] = [];

  //rows
  for (let y = 0; y < SIZE; y++) {
    winningSets.push(board.filter((square) => square.y === y));
  }

  //columns
  for (let x = 0; x < SIZE; x++) {
    winningSets.push(board.filter((square) => square.x === x));
  }

  //top left to bottom right diagnal
  winningSets.push(board.filter((square) => square.x === square.y));

  //bottom left to top right diagnal
  winningSets.push(board.filter((square) => square.x + square.y === SIZE - 1));

  return winningSets;
}

function allSpacesClaimed(board: Board): boolean {
  for (let square of board) {
    if (square.state === 'empty') {
      return false;
    }
  }
  return true;
}
