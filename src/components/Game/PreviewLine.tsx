export type PreviewLineProps = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    cellSize: number;
}

export function PreviewLine({ x1, y1, x2, y2, cellSize }: PreviewLineProps) {
            return (
                <g>
                    <line
                        x1={x1 * cellSize + cellSize/2 }
                        y1={y1 * cellSize + cellSize/2 }
                        x2={x2 * cellSize + cellSize/2 }
                        y2={y2 * cellSize + cellSize/2 }
                        stroke="var(--accent)"
                        strokeDasharray={cellSize/15}
                        strokeWidth={cellSize/3}
                    />
                </g>
            );
}
export default PreviewLine;
