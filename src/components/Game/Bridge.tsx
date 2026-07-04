// import { cellSize } from "../game/coordinates";

type BridgeProps = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    amount: 1 | 2;
    cellSize: number;
};

export function BridgeComponent({ x1, y1, x2, y2, amount, cellSize }: BridgeProps) {
    if (amount === 2) {
        return (
            <g>
                <line
                    x1={x1 * cellSize + cellSize/2 - cellSize/12}
                    y1={y1 * cellSize + cellSize/2 - cellSize/12}
                    x2={x2 * cellSize + cellSize/2 - cellSize/12}
                    y2={y2 * cellSize + cellSize/2 - cellSize/12}
                    stroke="lightgray"
                    strokeWidth={cellSize/12}
                />
                <line
                    x1={x1 * cellSize + cellSize/2 + cellSize/12}
                    y1={y1 * cellSize + cellSize/2 + cellSize/12}
                    x2={x2 * cellSize + cellSize/2 + cellSize/12}
                    y2={y2 * cellSize + cellSize/2 + cellSize/12}
                    stroke="lightgray"
                    strokeWidth={cellSize/12}
                />
            </g>
        );
    } else {
        return (
            <line
                x1={x1 * cellSize + cellSize/2}
                y1={y1 * cellSize + cellSize/2}
                x2={x2 * cellSize + cellSize/2}
                y2={y2 * cellSize + cellSize/2}
                stroke="lightgray"
                    strokeWidth={cellSize/12}
            />
        );
    }
}

export default BridgeComponent;
