
import type { Island, IslandState } from "../../game/types";

type IslandProps = {
    island: Island;
    selected: boolean;
    islandState: IslandState;
    cellSize: number;
};

export function IslandComponent({ island, selected, islandState, cellSize }: IslandProps) {
    const cx = island.x * cellSize + cellSize / 2;
    const cy = island.y * cellSize + cellSize / 2;
    return (
        <g>
            <circle
                cx={cx}
                cy={cy}
                r={cellSize / 2.4}
                fill={selected ? "var(--accent)" : "black"}
                stroke={islandState === "complete" ? "green" : islandState === "overfilled" ? "red" : "lightgray"}
                strokeWidth={cellSize / 7.5}
            />

            {islandState === "complete" && (
                <line
                    x1={island.x * cellSize + cellSize / 2 - cellSize / 3}
                    y1={island.y * cellSize + cellSize / 2 - cellSize / 3}
                    x2={island.x * cellSize + cellSize / 2 + cellSize / 3}
                    y2={island.y * cellSize + cellSize / 2 + cellSize / 3}
                    stroke="green"
                    strokeWidth={cellSize / 15}
                />
            )}

            {islandState === "overfilled" && (
                <>
                    <line
                        x1={island.x * cellSize + cellSize / 2 - cellSize / 3}
                        y1={island.y * cellSize + cellSize / 2 - cellSize / 3}
                        x2={island.x * cellSize + cellSize / 2 + cellSize / 3}
                        y2={island.y * cellSize + cellSize / 2 + cellSize / 3}
                        stroke="red"
                        strokeWidth={cellSize / 15}
                    />
                    <line
                        x1={island.x * cellSize + cellSize / 2 - cellSize / 3}
                        y1={island.y * cellSize + cellSize / 2 + cellSize / 3}
                        x2={island.x * cellSize + cellSize / 2 + cellSize / 3}
                        y2={island.y * cellSize + cellSize / 2 - cellSize / 3}
                        stroke="red"
                        strokeWidth={cellSize / 15}
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
                    fontSize: `${cellSize / 1.75}px`,
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
