import { simplifyBridge } from "./helpers";
import type { GameState } from "./types";
import { canConnect } from "./validation";

type Action = { type: "BRIDGE_ACTION"; from: number; to: number } | { type: "BRIDGE_REMOVAL"; from: number; to: number };
// | { type: "RESET" };

export function gameReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case "BRIDGE_ACTION": {
            const { from, to } = action;
            const fromIsland = state.islands.find((i) => i.id === from);
            const toIsland = state.islands.find((i) => i.id === to);

            if (!fromIsland || !toIsland || !canConnect(fromIsland, toIsland, state)) {
                return state;
            }
            const simplifiedBridge = simplifyBridge({ from: fromIsland, to: toIsland, count: 1 });
            const bridge = state.bridges.find((b) => b.from === simplifiedBridge.from && b.to === simplifiedBridge.to);
            const filtered = state.bridges.filter((b) => !(b.from === simplifiedBridge.from && b.to === simplifiedBridge.to));

            if (!bridge) {
                return { ...state, bridges: [...filtered, simplifiedBridge] };
            } else if (bridge.count === 1) {
                return { ...state, bridges: [...filtered, { ...simplifiedBridge, count: 2 }] };
            } else if (bridge.count === 2) {
                return { ...state, bridges: [...filtered]};
            }
            return state;
        }

        case "BRIDGE_REMOVAL": {
            const { from, to } = action;
            const fromIsland = state.islands.find((i) => i.id === from);
            const toIsland = state.islands.find((i) => i.id === to);
            if (!fromIsland || !toIsland) return state;
            const simplifiedBridge = simplifyBridge({ from: fromIsland, to: toIsland, count: 1 });
            const filtered = state.bridges.filter((b) => !(b.from === simplifiedBridge.from && b.to === simplifiedBridge.to));
            return { ...state, bridges: filtered };
        }

        default:
            return state;
    }
}
