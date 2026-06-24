export type Island = {
    id: number;
    x: number;
    y: number;
    value: number;
};

export type Bridge = {
    from: number;
    to: number;
    count: 1 | 2;
};

export type GameState = {
    islands: Island[];
    bridges: Bridge[];
    width: number;
    height: number;
};

export type DragState = {
    from: number;
    hasMoved: boolean;
};

export type IslandState = "complete" | "overfilled" | "incomplete";