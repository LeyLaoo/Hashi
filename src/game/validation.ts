import { isHorizontal, crosses, isVertical } from "./geometry";
import { bridgeToSeg } from "./helpers";
import type { Bridge, GameState, Island } from "./types";

export function isSolved() {
    // check if puzzle is complete
}

export function canConnect(island1: Island, island2: Island, state: GameState) {
    if (island1.id === island2.id) {
        return false;
    }
    if (island1.x !== island2.x && island1.y !== island2.y) {
        return false;
    }
    if (island1.x === island2.x) {
        const minY = Math.min(island1.y, island2.y);
        const maxY = Math.max(island1.y, island2.y);
        if (
            state.islands.some(
                (island) =>
                    island.x === island1.x &&
                    island.y > minY &&
                    island.y < maxY,
            )
        ) {
            return false;
        }
    } else if (island1.y === island2.y) {
        const minX = Math.min(island1.x, island2.x);
        const maxX = Math.max(island1.x, island2.x);
        if (
            state.islands.some(
                (island) =>
                    island.y === island1.y &&
                    island.x > minX &&
                    island.x < maxX,
            )
        ) {
            return false;
        }
    }

    return (
        wouldCross({ from: island1.id, to: island2.id, count: 1 }, state) ===
        false
    );
}

function wouldCross(newBridge: Bridge, state: GameState) {
    const newSeg = bridgeToSeg(newBridge, state.islands);

    return state.bridges.some((b) => {
        const s = bridgeToSeg(b, state.islands);

        return (
            isHorizontal(newSeg) !== isHorizontal(s) &&
            crosses(
                isHorizontal(newSeg) ? newSeg : s,
                isVertical(newSeg) ? newSeg : s,
            )
        );
    });
}
