import { useEffect, useReducer, useState } from "react";
import type { Bridge, DragState, GameCompletionState, GameState } from "../game/types";
import { gameReducer } from "../game/reducer";
import { getBridgeAtPosition, getCandidateIsland, getIslandOnPosition } from "../game/helpers";
import { getSVGCoordinates } from "../game/coordinates";
import { canConnect, gameCompletionState } from "../game/validation";

export function useGame(initialState: GameState) {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const [selectedIsland, setSelectedIsland] = useState<number | null>(null);
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [hoveredBridge, setHoveredBridge] = useState<Bridge | null>(null);
    const [completionState, setCompletionState] = useState<GameCompletionState>("incomplete");

    useEffect(() => {
        setCompletionState(gameCompletionState(state.islands, state.bridges));
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

    function handlePointerDown(event: React.PointerEvent<SVGGElement>) {
        event.currentTarget.setPointerCapture(event.pointerId);
        const { x, y } = getSVGCoordinates(event);
        const originalIsland = getIslandOnPosition(x, y, state.islands);
        if (originalIsland) {
            setDragState({
                from: originalIsland,
                to: null,
            });
            return;
        }
        const bridge = getBridgeAtPosition(x, y, state.bridges);
        if (bridge) {
            setHoveredBridge(bridge);
        }
    }

    function handlePointerMove(event: React.PointerEvent<SVGGElement>) {
        const { x, y } = getSVGCoordinates(event);
        if (dragState) {
            if (Math.abs(x - dragState.from.x) > 0.5 || Math.abs(y - dragState.from.y) > 0.5) {
                const candidateIsland = getCandidateIsland(state, dragState.from, x, y);
                if (candidateIsland && canConnect(dragState.from, candidateIsland, state)) {
                    setDragState({
                        ...dragState,
                        to: candidateIsland,
                    });
                    setSelectedIsland(null);
                } else {
                    setDragState({
                        ...dragState,
                        to: null,
                    });
                }
            } else {
                setDragState({
                    ...dragState,
                    to: null,
                });
            }
            return;
        }
        const island = getIslandOnPosition(x, y, state.islands);
        const bridge = getBridgeAtPosition(x, y, state.bridges);
        if (!island && bridge) {
            setHoveredBridge(bridge);
        } else {
            setHoveredBridge(null);
        }
    }

    function handlePointerUp(event: React.PointerEvent<SVGGElement>) {
        const { x, y } = getSVGCoordinates(event);
        const bridge = getBridgeAtPosition(x, y, state.bridges);
        const island = getIslandOnPosition(x, y, state.islands);

        if (dragState && dragState.to) {
            dispatch({
                type: "BRIDGE_ACTION",
                from: dragState.from.id,
                to: dragState.to.id,
            });
        } else if (island) {
            handleIslandClick(island.id);
        } else if (bridge) {
            dispatch({
                type: "BRIDGE_REMOVAL",
                from: bridge.from.id,
                to: bridge.to.id,
            });
        }
        setHoveredBridge(null);
        setDragState(null);
    }

    return {
        state,
        selectedIsland,
        hoveredBridge,
        handleIslandClick,
        completionState,
        dragState,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
    };
}
