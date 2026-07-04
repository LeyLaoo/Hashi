import type { Bridge, Island } from "../../game/types";
import BridgeComponent from "./Bridge";
import IslandComponent from "./Island";
import PreviewLine from "./PreviewLine";
import "./board.css";
import { useGame } from "../../hooks/useGame";
import { getIslandState } from "../../game/helpers";
import { setCellSize } from "../../game/coordinates";
import { generatePuzzle } from "../../game/generation";
import WinnerPopUp from "./WinnerPopUp";
import ConnectionPopUp from "./ConnectionPopUp";
import DottedLine from "./DottedLine";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type BoardProps = {
    maxCellSize: number;
    width: number;
    height: number;
};

export function Board({ maxCellSize, width, height }: BoardProps) {
    const boardRef = useRef<HTMLDivElement>(null);
    const [computedCellSize, setComputedCellSize] = useState(maxCellSize);
    const initialState = generatePuzzle(width, height, 100);
    /* const initialState = {
        width: 3,
        height: 3,
        islands: [
            {
                id: 0,
                x: 2,
                y: 2,
                value: 2,
            },
            {
                id: 1,
                x: 0,
                y: 2,
                value: 1,
            },
            {
                id: 2,
                x: 2,
                y: 0,
                value: 2,
            },
            {
                id: 3,
                x: 0,
                y: 0,
                value: 1,
            },
        ],
        bridges: [],
        allConnectionHintShown: false,
    }; */

    useLayoutEffect(() => {
        const board = boardRef.current;
        if (!board) return;
        const container = board.parentElement;
        if (!container) return;

        const computeSize = () => {
            const containerRect = container.getBoundingClientRect();
            if (containerRect.width === 0) return;
            const sizeX = Math.floor(containerRect.width / (width + 1));
            const sizeY = containerRect.height > 0 ? Math.floor(containerRect.height / (height + 1)) : sizeX;
            const nextCellSize = Math.max(8, Math.min(maxCellSize, Math.min(sizeX, sizeY)));

            setComputedCellSize(nextCellSize);
        };

        computeSize();

        const resizeObserver = new ResizeObserver(computeSize);
        resizeObserver.observe(container);
        window.addEventListener("resize", computeSize);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", computeSize);
        };
    }, [height, maxCellSize, width]);

    useEffect(() => {
        setCellSize(computedCellSize);
    }, [computedCellSize]);

    const { state, selectedIsland, hoveredBridge, completionState, dragState, handlePointerDown, handlePointerMove, handlePointerUp } = useGame(initialState);
    const [showWinner, setShowWinner] = useState(false);
    const [showConnection, setShowConnection] = useState(false);

    useEffect(() => {
        if (completionState === "complete") setShowWinner(true);
    }, [completionState]);

    useEffect(() => {
        if (completionState === "notConnected" && !state.allConnectionHintShown) setShowConnection(true);
    }, [completionState]);

    let popUp = null;
    if (showWinner) {
        popUp = <WinnerPopUp onConfirm={() => setShowWinner(false)} />;
    } else if (showConnection && !state.allConnectionHintShown) {
        popUp = (
            <ConnectionPopUp
                onConfirm={() => {
                    state.allConnectionHintShown = true;
                    setShowConnection(false);
                }}
            />
        );
    }
    const isFrozen = popUp !== null;
    return (
        <div
            ref={boardRef}
            className="board"
            style={{
                width: state.width * computedCellSize,
                height: state.height * computedCellSize,
                padding: computedCellSize / 12,
            }}
        >
            <svg width="100%" height="100%" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerDown={handlePointerDown}>
                <g>
                    {Array.from({ length: state.width }, (_, x) => (
                        <DottedLine key={`v-${x}`} x1={x} y1={0} x2={x} y2={state.height - 1} cellSize={computedCellSize} />
                    ))}
                    {Array.from({ length: state.height }, (_, y) => (
                        <DottedLine key={`h-${y}`} x1={0} y1={y} x2={state.width - 1} y2={y} cellSize={computedCellSize} />
                    ))}
                </g>
                {dragState?.to && (
                    <PreviewLine
                        key={dragState.from + "-" + dragState.to}
                        x1={dragState.from.x}
                        y1={dragState.from.y}
                        x2={dragState.to.x}
                        y2={dragState.to.y}
                        cellSize={computedCellSize}
                    />
                )}
                {hoveredBridge && (
                    <PreviewLine
                        key={hoveredBridge.from + "-" + hoveredBridge.to}
                        x1={hoveredBridge.from.x}
                        y1={hoveredBridge.from.y}
                        x2={hoveredBridge.to.x}
                        y2={hoveredBridge.to.y}
                        cellSize={computedCellSize}
                    />
                )}
                {state.bridges.map((bridge: Bridge) => {
                    return (
                        <BridgeComponent
                            key={bridge.from.x + "," + bridge.from.y + "-" + bridge.to.x + "," + bridge.to.y}
                            x1={bridge.from.x}
                            y1={bridge.from.y}
                            x2={bridge.to.x}
                            y2={bridge.to.y}
                            amount={bridge.count}
                            cellSize={computedCellSize}
                        />
                    );
                })}
                {state.islands.map((island: Island) => (
                    <IslandComponent
                        key={island.id}
                        island={island}
                        selected={selectedIsland === island.id}
                        islandState={getIslandState(island, state.bridges)}
                        cellSize={computedCellSize}
                    />
                ))}
            </svg>
            {isFrozen && (
                <div className="board-overlay" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()}>
                    {popUp}
                </div>
            )}
        </div>
    );
}

export default Board;
