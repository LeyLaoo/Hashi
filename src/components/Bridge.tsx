import { CELL_SIZE, OFFSET } from "../game/coordinates";

type BridgeProps = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    amount: 1 | 2;
};

export function BridgeComponent({ x1, y1, x2, y2, amount }: BridgeProps) {
    if (amount === 2) {
        return (
            <g>
                <line
                    x1={x1 * CELL_SIZE + OFFSET - 5}
                    y1={y1 * CELL_SIZE + OFFSET - 5}
                    x2={x2 * CELL_SIZE + OFFSET - 5}
                    y2={y2 * CELL_SIZE + OFFSET - 5}
                    stroke="lightgray"
                    strokeWidth={5}
                />
                <line
                    x1={x1 * CELL_SIZE + OFFSET + 5}
                    y1={y1 * CELL_SIZE + OFFSET + 5}
                    x2={x2 * CELL_SIZE + OFFSET + 5}
                    y2={y2 * CELL_SIZE + OFFSET + 5}
                    stroke="lightgray"
                    strokeWidth={5}
                />
            </g>
        );
    } else {
        return (
            <line
                x1={x1 * CELL_SIZE + OFFSET}
                y1={y1 * CELL_SIZE + OFFSET}
                x2={x2 * CELL_SIZE + OFFSET}
                y2={y2 * CELL_SIZE + OFFSET}
                stroke="lightgray"
                strokeWidth={5}
            />
        );
    }
}

export default BridgeComponent;
