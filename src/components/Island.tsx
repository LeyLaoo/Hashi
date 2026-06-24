import { CELL_SIZE, OFFSET } from "../game/coordinates";
import type { Island, IslandState } from "../game/types";

type IslandProps = {
    island: Island;
};

export function IslandComponent({
    island,
    selected,
    onMouseDown,
    islandState,
}: IslandProps & {
    selected: boolean;
    onMouseDown: (id: number, event: React.MouseEvent<SVGGElement>) => void;
    islandState: IslandState;
}) {
    const cx = island.x * CELL_SIZE + OFFSET;
    const cy = island.y * CELL_SIZE + OFFSET;
    return (
        <g onPointerDown={(e) => onMouseDown(island.id, e)}>
            <circle
                cx={cx}
                cy={cy}
                r={25}
                fill={selected ? "var(--accent)" : "black"}
                stroke={
                    islandState === "complete"
                        ? "green"
                        : islandState === "overfilled"
                          ? "red"
                          : "lightgray"
                }
                strokeWidth={8}
            />

            {islandState === "complete" && (
                <line
                    x1={island.x * CELL_SIZE + OFFSET - CELL_SIZE/3}
                    y1={island.y * CELL_SIZE + OFFSET - CELL_SIZE/3}
                    x2={island.x * CELL_SIZE + OFFSET + CELL_SIZE/3}
                    y2={island.y * CELL_SIZE + OFFSET + CELL_SIZE/3}
                    stroke="green"
                    strokeWidth={4}
                />
            )}

            {islandState === "overfilled" && (
                <>
                    <line
                        x1={island.x * CELL_SIZE + OFFSET - CELL_SIZE/3}
                        y1={island.y * CELL_SIZE + OFFSET - CELL_SIZE/3}
                        x2={island.x * CELL_SIZE + OFFSET + CELL_SIZE/3}
                        y2={island.y * CELL_SIZE + OFFSET + CELL_SIZE/3}
                        stroke="red"
                        strokeWidth={4}
                    />
                    <line
                        x1={island.x * CELL_SIZE + OFFSET - CELL_SIZE/3}
                        y1={island.y * CELL_SIZE + OFFSET + CELL_SIZE/3}
                        x2={island.x * CELL_SIZE + OFFSET + CELL_SIZE/3}
                        y2={island.y * CELL_SIZE + OFFSET - CELL_SIZE/3}
                        stroke="red"
                        strokeWidth={4}
                    />
                </>
            )}

            <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                    pointerEvents: "none",
                    fontSize: "30px",
                    fontWeight: "bold",
                    fill: "lightgray",
                }}
            >
                {island.value}
            </text>
        </g>
    );
}

export default IslandComponent;
