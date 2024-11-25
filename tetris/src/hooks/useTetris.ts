import { useCallback, useEffect, useState } from "react";
import {
  Block,
  BlockShape,
  BoardShape,
  GhostBlock,
  EmptyCell,
  SHAPES,
} from "@/types/types";
import { useInterval } from "@/hooks/useIntervals";
import {
  useTetrisBoard,
  hasCollisions,
  BOARD_HEIGHT,
  getEmptyBoard,
  getRandomBlock,
} from "./useTetrisBoard";

enum TickSpeed {
  Normal = 800,
  Sliding = 100,
  Fast = 30,
}

interface structuredClone {
  (obj: any): any;
}

export function useTetris(gameOverCallback: () => void) {
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [level, setLevel] = useState(1);
  const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);

  const [
    { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  // Calculate level based on lines cleared
  useEffect(() => {
    const newLevel = Math.floor(linesCleared / 10) + 1;
    setLevel(newLevel);
  }, [linesCleared]);

  // Calculate game speed based on level
  const calculateGameSpeed = useCallback((currentLevel: number) => {
    const newSpeed = TickSpeed.Normal - (currentLevel - 1) * 60;
    return Math.max(newSpeed, 200);
  }, []);

  function getGhostPosition(): number {
    let ghostRow = droppingRow;
    while (!hasCollisions(board, droppingShape, ghostRow + 1, droppingColumn)) {
      ghostRow++;
    }
    return ghostRow;
  }

  // Pause and Resume functions
  const pauseGame = useCallback(() => {
    if (isPlaying && !isPaused) {
      setIsPaused(true);
      setTickSpeed(null);
    }
  }, [isPlaying, isPaused]);

  const resumeGame = useCallback(() => {
    if (isPlaying && isPaused) {
      setIsPaused(false);
      setTickSpeed(calculateGameSpeed(level));
    }
  }, [isPlaying, isPaused, level, calculateGameSpeed]);

  const hardDrop = useCallback(() => {
    const ghostRow = getGhostPosition();
    dispatchBoardState({
      type: "hardDrop",
      dropRow: ghostRow,
    });
    setIsCommitting(true);
    setTickSpeed(TickSpeed.Sliding);
  }, [dispatchBoardState, board, droppingShape, droppingRow, droppingColumn]);

  const startGame = useCallback(() => {
    const startingBlocks = [
      getRandomBlock(),
      getRandomBlock(),
      getRandomBlock(),
    ];
    setScore(0);
    setLinesCleared(0);
    setLevel(1);
    setUpcomingBlocks(startingBlocks);
    setIsCommitting(false);
    setIsPlaying(true);
    setIsPaused(false);
    setTickSpeed(TickSpeed.Normal);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState]);

  const commitPosition = useCallback(() => {
    if (!hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)) {
      setIsCommitting(false);
      setTickSpeed(calculateGameSpeed(level));
      return;
    }

    const newBoard = structuredClone(board) as BoardShape;
    addShapeToBoard(
      newBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    );

    let numCleared = 0;
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (newBoard[row].every((entry) => entry !== EmptyCell.Empty)) {
        numCleared++;
        newBoard.splice(row, 1);
      }
    }

    setLinesCleared((prev) => prev + numCleared);

    const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
    const newBlock = newUpcomingBlocks.pop() as Block;
    newUpcomingBlocks.unshift(getRandomBlock());

    if (hasCollisions(board, SHAPES[newBlock].shape, 0, 3)) {
      setIsPlaying(false);
      setTickSpeed(null);
      setIsPaused(false);
      gameOverCallback();
    } else {
      setTickSpeed(calculateGameSpeed(level));
    }

    setUpcomingBlocks(newUpcomingBlocks);
    setScore((prevScore) => prevScore + getPoints(numCleared));
    dispatchBoardState({
      type: "commit",
      newBoard: [...getEmptyBoard(BOARD_HEIGHT - newBoard.length), ...newBoard],
      newBlock,
    });
    setIsCommitting(false);
  }, [
    board,
    dispatchBoardState,
    droppingBlock,
    droppingColumn,
    droppingRow,
    droppingShape,
    upcomingBlocks,
    level,
    gameOverCallback,
    calculateGameSpeed,
  ]);

  const gameTick = useCallback(() => {
    if (isCommitting) {
      commitPosition();
    } else if (
      hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)
    ) {
      setTickSpeed(TickSpeed.Sliding);
      setIsCommitting(true);
    } else {
      dispatchBoardState({ type: "drop" });
    }
  }, [
    board,
    commitPosition,
    dispatchBoardState,
    droppingColumn,
    droppingRow,
    droppingShape,
    isCommitting,
  ]);

  useInterval(() => {
    if (!isPlaying || isPaused) {
      return;
    }
    gameTick();
  }, tickSpeed);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let isPressingLeft = false;
    let isPressingRight = false;
    let moveIntervalID: ReturnType<typeof setInterval> | undefined;

    const updateMovementInterval = () => {
      clearInterval(moveIntervalID);
      dispatchBoardState({
        type: "move",
        isPressingLeft,
        isPressingRight,
      });
      moveIntervalID = setInterval(() => {
        dispatchBoardState({
          type: "move",
          isPressingLeft,
          isPressingRight,
        });
      }, 300);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      if (event.key === "Escape") {
        if (isPaused) {
          resumeGame();
        } else {
          pauseGame();
        }
        return;
      }

      // Only handle other keys if game is not paused
      if (!isPaused) {
        if (event.code === "Space") {
          event.preventDefault();
          hardDrop();
          return;
        }

        if (event.key === "ArrowDown") {
          setTickSpeed(TickSpeed.Fast);
        }

        if (event.key === "ArrowUp") {
          dispatchBoardState({
            type: "move",
            isRotating: true,
          });
        }

        if (event.key === "ArrowLeft") {
          isPressingLeft = true;
          updateMovementInterval();
        }

        if (event.key === "ArrowRight") {
          isPressingRight = true;
          updateMovementInterval();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!isPaused) {
        if (event.key === "ArrowDown") {
          setTickSpeed(calculateGameSpeed(level));
        }

        if (event.key === "ArrowLeft") {
          isPressingLeft = false;
          updateMovementInterval();
        }

        if (event.key === "ArrowRight") {
          isPressingRight = false;
          updateMovementInterval();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      clearInterval(moveIntervalID);
      setTickSpeed(calculateGameSpeed(level));
    };
  }, [
    dispatchBoardState,
    isPlaying,
    hardDrop,
    isPaused,
    pauseGame,
    resumeGame,
    level,
    calculateGameSpeed,
  ]);

  const renderedBoard = structuredClone(board) as BoardShape;
  if (isPlaying) {
    addShapeToBoard(
      renderedBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    );

    const ghostRow = getGhostPosition();
    addShapeToBoard(
      renderedBoard,
      droppingBlock,
      droppingShape,
      ghostRow,
      droppingColumn,
      true
    );
  }

  return {
    board: renderedBoard,
    startGame,
    pauseGame,
    resumeGame,
    isPlaying,
    isPaused,
    score,
    level,
    linesCleared,
    upcomingBlocks,
  };
}

function getPoints(numCleared: number): number {
  switch (numCleared) {
    case 0:
      return 0;
    case 1:
      return 100;
    case 2:
      return 300;
    case 3:
      return 500;
    case 4:
      return 800;
    default:
      throw new Error("Unexpected number of rows cleared");
  }
}

function addShapeToBoard(
  board: BoardShape,
  droppingBlock: Block,
  droppingShape: BlockShape,
  droppingRow: number,
  droppingColumn: number,
  isGhost: boolean = false
) {
  const blockType = isGhost
    ? (`${droppingBlock}Ghost` as GhostBlock)
    : droppingBlock;
  droppingShape
    .filter((row) => row.some((isSet) => isSet))
    .forEach((row: boolean[], rowIndex: number) => {
      row.forEach((isSet: boolean, colIndex: number) => {
        if (isSet) {
          board[droppingRow + rowIndex][droppingColumn + colIndex] = blockType;
        }
      });
    });
}
