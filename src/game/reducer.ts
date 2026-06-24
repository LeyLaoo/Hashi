import { simplifyBridge } from "./helpers";
import type { GameState } from "./types";
import { canConnect } from "./validation";

type Action =
    | { type: "BRIDGE_ACTION"; from: number; to: number }
    // | { type: "RESET" };

export function gameReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case "BRIDGE_ACTION": {
            const { from, to } = action;
            const fromIsland = state.islands.find((i) => i.id === from);
            const toIsland = state.islands.find((i) => i.id === to);
            
            if (!canConnect(fromIsland!, toIsland!, state)) {
                return state;
            }
            const simplifiedBridge = simplifyBridge({ from, to, count: 1 });
            const bridge = state.bridges.find(
                (b) =>
                    b.from === simplifiedBridge.from &&
                    b.to === simplifiedBridge.to,
            );

            state.bridges = state.bridges.filter(
                (b) =>
                    !(
                        b.from === simplifiedBridge.from &&
                        b.to === simplifiedBridge.to
                    ),
            );
            if (!bridge) {
                state.bridges.push(simplifiedBridge);
                return state;
            } else if (bridge.count === 1) {
                state.bridges.push({ ...simplifiedBridge, count: 2 });
                return state;
            } else if (bridge.count === 2) {
                return state;
            }
            return state;
        }

        default:
            return state;
    }
}
