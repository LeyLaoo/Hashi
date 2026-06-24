import type { Bridge, GameState, Island } from "../game/types";
import BridgeComponent from "./Bridge";
import IslandComponent from "./Island";
import "./board.css";
import { useGame } from "../hooks/useGame";
import { getIslandState } from "../game/helpers";
import { CELL_SIZE } from "../game/coordinates";

export function Board() {
    const initialState: GameState = {
        width: 5,
        height: 5,
        islands: [
            { id: 1, x: 0, y: 0, value: 1 },
            { id: 2, x: 2, y: 0, value: 2 },
            { id: 3, x: 2, y: 3, value: 3 },
            { id: 4, x: 3, y: 1, value: 4 },
            { id: 5, x: 0, y: 4, value: 5 },
            { id: 6, x: 4, y: 4, value: 6 },
            { id: 7, x: 4, y: 0, value: 7 },
            { id: 8, x: 1, y: 1, value: 8 },
        ],
        bridges: [
            { from: 1, to: 5, count: 2 },
            { from: 5, to: 6, count: 1 },
            { from: 6, to: 7, count: 1 },
        ],
    };
    /* const initialState: GameState = {
        width: 5,
        height: 5,
        islands: [
            { id: 1, x: 0, y: 0, value: 2 },
            { id: 2, x: 2, y: 0, value: 4 },
            { id: 3, x: 2, y: 3, value: 2 }
        ],
        bridges: [
        ],
    }; */
    /*const initialState: GameState = {
        width: 10,
        height: 15,
        islands: [
            { id: 1, x: 0, y: 0, value: 2 },
            { id: 2, x: 3, y: 0, value: 2 },
            { id: 3, x: 5, y: 0, value: 5 },
            { id: 4, x: 8, y: 0, value: 3 },
            { id: 5, x: 1, y: 1, value: 4 },
            { id: 6, x: 4, y: 1, value: 2 },
            { id: 7, x: 7, y: 1, value: 1 },
            { id: 8, x: 9, y: 1, value: 2 },
            { id: 9, x: 0, y: 2, value: 1 },
            { id: 10, x: 8, y: 2, value: 1 },
            { id: 11, x: 1, y: 3, value: 4 },
            { id: 12, x: 5, y: 3, value: 6 },
            { id: 13, x: 7, y: 3, value: 3 },
            { id: 14, x: 9, y: 3, value: 4 },
            { id: 15, x: 0, y: 4, value: 1 },
            { id: 16, x: 6, y: 4, value: 1 },
            { id: 17, x: 8, y: 4, value: 2 },
            { id: 18, x: 1, y: 5, value: 4 },
            { id: 19, x: 3, y: 5, value: 2 },
            { id: 20, x: 9, y: 5, value: 3 },
            { id: 21, x: 0, y: 6, value: 3 },
            { id: 22, x: 2, y: 6, value: 2 },
            { id: 23, x: 5, y: 6, value: 6 },
            { id: 24, x: 7, y: 6, value: 1 },
            { id: 25, x: 1, y: 7, value: 4 },
            { id: 26, x: 3, y: 7, value: 2 },
            { id: 27, x: 9, y: 7, value: 3 },
            { id: 28, x: 0, y: 8, value: 3 },
            { id: 29, x: 2, y: 8, value: 2 },
            { id: 30, x: 5, y: 8, value: 6 },
            { id: 31, x: 8, y: 8, value: 4 },
            { id: 32, x: 1, y: 9, value: 5 },
            { id: 33, x: 4, y: 9, value: 2 },
            { id: 34, x: 9, y: 9, value: 3 },
            { id: 35, x: 0, y: 10, value: 3 },
            { id: 36, x: 6, y: 10, value: 1 },
            { id: 37, x: 8, y: 10, value: 4 },
            { id: 38, x: 3, y: 11, value: 2 },
            { id: 39, x: 5, y: 11, value: 6 },
            { id: 40, x: 7, y: 11, value: 2 },
            { id: 41, x: 9, y: 11, value: 4 },
            { id: 42, x: 0, y: 12, value: 3 },
            { id: 43, x: 6, y: 12, value: 2 },
            { id: 44, x: 8, y: 12, value: 4 },
            { id: 48, x: 1, y: 13, value: 2 },
            { id: 49, x: 5, y: 13, value: 3 },
            { id: 50, x: 7, y: 13, value: 2 },
            { id: 51, x: 9, y: 13, value: 2 },
            { id: 52, x: 0, y: 14, value: 3 },
            { id: 53, x: 3, y: 14, value: 3 },
            { id: 54, x: 6, y: 14, value: 2 },
            { id: 55, x: 8, y: 14, value: 3 },
        ],
        bridges: [],
    };*/
    const {
        state,
        selectedIsland,
        isSolved,
        dragState,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp
    } = useGame(initialState);
    if (isSolved) {
        alert("DU BIST DIE BESTE!");
    }
    //TODO Schöner Completion oder so
    return (
        <div
            className="board"
            style={{
                width: state.width * CELL_SIZE,
                height: state.height * CELL_SIZE,
            }}
        >
            <svg
                width="100%"
                height="100%"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                {state.bridges.map((bridge: Bridge) => {
                    const fromIsland = state.islands.find(
                        (i: Island) => i.id === bridge.from,
                    )!;
                    const toIsland = state.islands.find(
                        (i: Island) => i.id === bridge.to,
                    )!;
                    return (
                        <BridgeComponent
                            x1={fromIsland.x}
                            y1={fromIsland.y}
                            x2={toIsland.x}
                            y2={toIsland.y}
                            amount={bridge.count}
                        />
                    );
                })}
                {state.islands.map((island: Island) => (
                    <IslandComponent
                        key={island.id}
                        island={island}
                        selected={selectedIsland === island.id}
                        onMouseDown={handlePointerDown}
                        islandState={getIslandState(island, state.bridges)}
                    />
                ))}
            </svg>
        </div>
    );
}

export default Board;
