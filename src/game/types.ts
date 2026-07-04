export type Island = {
    id: number;
    x: number;
    y: number;
    value: number;
};

export type Bridge = {
    from: Island;
    to: Island;
    count: 1 | 2;
};

export type GameState = {
    islands: Island[];
    bridges: Bridge[];
    width: number;
    height: number;
    allConnectionHintShown: boolean;
};

export type DragState = {
    from: Island;
    to: Island | null;
};

export type GameCompletionState = "incomplete" | "complete" | "notConnected"
export type Direction = "up" | "down" | "left" | "right";
export type IslandState = "complete" | "overfilled" | "incomplete";