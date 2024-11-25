export enum Block {
  I = "I",
  J = "J",
  L = "L",
  O = "O",
  S = "S",
  T = "T",
  Z = "Z",
}

export enum GhostBlock {
  IGhost = "IGhost",
  JGhost = "JGhost",
  LGhost = "LGhost",
  OGhost = "OGhost",
  SGhost = "SGhost",
  TGhost = "TGhost",
  ZGhost = "ZGhost",
}

export enum EmptyCell {
  Empty = "Empty",
}

export type CellOptions = Block | GhostBlock | EmptyCell;
export type BoardShape = CellOptions[][];
export type BlockShape = boolean[][];

export const SHAPES: { [key in Block]: { shape: BlockShape } } = {
  I: {
    shape: [
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, false],
    ],
  },
  J: {
    shape: [
      [true, false, false],
      [true, true, true],
      [false, false, false],
    ],
  },
  L: {
    shape: [
      [false, false, true],
      [true, true, true],
      [false, false, false],
    ],
  },
  O: {
    shape: [
      [true, true],
      [true, true],
    ],
  },
  S: {
    shape: [
      [false, true, true],
      [true, true, false],
      [false, false, false],
    ],
  },
  T: {
    shape: [
      [false, true, false],
      [true, true, true],
      [false, false, false],
    ],
  },
  Z: {
    shape: [
      [true, true, false],
      [false, true, true],
      [false, false, false],
    ],
  },
};
