// import { cellSize } from "../game/coordinates";

export type DottedLineProps = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    cellSize: number;
};

export function DottedLine({ x1, y1, x2, y2, cellSize }: DottedLineProps) {
    return (
        <line
            x1={x1 * cellSize + cellSize/2}
            y1={y1 * cellSize + cellSize/2}
            x2={x2 * cellSize + cellSize/2}
            y2={y2 * cellSize + cellSize/2}
            stroke="gray"
            strokeDasharray={cellSize / 15}
            strokeWidth={cellSize / 20}
        />
    );
}
export default DottedLine;
