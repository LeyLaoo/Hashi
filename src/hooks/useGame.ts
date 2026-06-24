import { useEffect, useReducer, useState } from "react";
import type { DragState, GameState } from "../game/types";
import { gameReducer } from "../game/reducer";
import { getCandidateIsland, isGameComplete } from "../game/helpers";
import { CELL_SIZE, OFFSET } from "../game/coordinates";

export function useGame(initialState: GameState) {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const [selectedIsland, setSelectedIsland] = useState<number | null>(null);
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [isSolved, setIsSolved] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsSolved(isGameComplete(state.islands, state.bridges));
    }, [state.islands, state.bridges]);

    function handleIslandClick(id: number) {
        if (!selectedIsland) {
            setSelectedIsland(id);
            return;
        }

        dispatch({
            type: "BRIDGE_ACTION",
            from: selectedIsland,
            to: id,
        });

        setSelectedIsland(null);
    }

    function handlePointerDown(id: number) {
        setDragState({
            from: id,
            hasMoved: false,
        });
    }

    function handlePointerMove(event: React.MouseEvent<SVGGElement>) {
        if (!dragState) return;
        const originalIsland = state.islands[dragState.from];
        const gridX = (event.clientX - OFFSET) / CELL_SIZE;
        const gridY = (event.clientY - OFFSET) / CELL_SIZE;
        console.log("MOVED ALERT")
        if (
            Math.abs(gridX - originalIsland.x) > 15 ||
            Math.abs(gridY - originalIsland.y) > 15
        ) {
            setDragState({
                ...dragState,
                hasMoved: true,
            });
        }
    }

    function handlePointerUp(event: React.MouseEvent<SVGGElement>) {
        if (!dragState) return;

        const gridX = (event.clientX - OFFSET) / CELL_SIZE;
        const gridY = (event.clientY - OFFSET) / CELL_SIZE;
        const candidateIsland = getCandidateIsland(
            state,
            state.islands[dragState.from],
            gridX,
            gridY,
        );
        if (dragState.hasMoved) {
            console.log(candidateIsland)
            if (candidateIsland) {
                dispatch({
                    type: "BRIDGE_ACTION",
                    from: dragState.from,
                    to: candidateIsland.id,
                });
            }
        } else {
            handleIslandClick(dragState.from);
        }
        setDragState(null)
    }

    return {
        state,
        selectedIsland,
        handleIslandClick,
        isSolved,
        dragState,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
    };
}
