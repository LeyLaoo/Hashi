import { seg } from "./geometry";
import type { Bridge, GameState, Island, IslandState } from "./types";

export function simplifyBridge(bridge: Bridge) {
    if (bridge.from < bridge.to) {
        return bridge;
    } else {
        return {
            from: bridge.to,
            to: bridge.from,
            count: bridge.count,
        };
    }
}

export function bridgeToSeg(bridge: Bridge, islands: Island[]) {
    const from = islands.find((i) => i.id === bridge.from)!;
    const to = islands.find((i) => i.id === bridge.to)!;

    return seg(from, to);
}

function getIslandBridgeAmount(islandId: number, bridges: Bridge[]): number {
    return bridges.reduce((sum, b) => {
        if (b.from === islandId || b.to === islandId) {
            return sum + b.count;
        }
        return sum;
    }, 0);
}

export function isIslandComplete(island: Island, bridges: Bridge[]): boolean {
    return getIslandBridgeAmount(island.id, bridges) === island.value;
}

export function isIslandOverfilled(island: Island, bridges: Bridge[]): boolean {
    return getIslandBridgeAmount(island.id, bridges) > island.value;
}

export function isGameComplete(islands: Island[], bridges: Bridge[]): boolean {
    islands.every((island) => console.log(isIslandComplete(island, bridges)));
    return (
        islands.every((island) => isIslandComplete(island, bridges)) &&
        isFullyConnected(islands, bridges)
    );
}

export function getIslandState(island: Island, bridges: Bridge[]): IslandState {
    if (isIslandComplete(island, bridges)) {
        return "complete";
    } else if (isIslandOverfilled(island, bridges)) {
        return "overfilled";
    }
    return "incomplete";
}

function buildAdjacency(islands: Island[], bridges: Bridge[]) {
    const graph = new Map<number, Set<number>>();

    for (const island of islands) {
        graph.set(island.id, new Set());
    }

    for (const b of bridges) {
        graph.get(b.from)?.add(b.to);
        graph.get(b.to)?.add(b.from);
    }

    return graph;
}

function isFullyConnected(islands: Island[], bridges: Bridge[]): boolean {
    if (islands.length === 0) return true;

    const graph = buildAdjacency(islands, bridges);

    const visited = new Set<number>();
    const start = islands[0].id;

    const stack = [start];
    visited.add(start);

    while (stack.length > 0) {
        const current = stack.pop()!;
        const neighbors = graph.get(current)!;

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                stack.push(neighbor);
            }
        }
    }

    return visited.size === islands.length;
}

export function getCandidateIsland(
    state: GameState,
    originalIsland: Island,
    mouseX: number,
    mouseY: number,
): Island | null {
    if (originalIsland.x < mouseX) {
        if (
            Math.abs(originalIsland.x - mouseX) <
            Math.abs(originalIsland.y - mouseY)
        ) {
            return findNextIsland(state.islands, originalIsland, "right");
        } else if (originalIsland.y < mouseY) {
            return findNextIsland(state.islands, originalIsland, "down");
        } else {
            return findNextIsland(state.islands, originalIsland, "up");
        }
    } else {
        if (
            Math.abs(originalIsland.x - mouseX) <
            Math.abs(originalIsland.y - mouseY)
        ) {
            return findNextIsland(state.islands, originalIsland, "left");
        } else if (originalIsland.y < mouseY) {
            return findNextIsland(state.islands, originalIsland, "down");
        } else {
            return findNextIsland(state.islands, originalIsland, "up");
        }
    }
}

function findNextIsland(
    islands: Island[],
    start: Island,
    direction: "left" | "right" | "up" | "down"
): Island | null {
    return islands
        .filter(i => {
            switch (direction) {
                case "left":
                    return i.y === start.y && i.x < start.x;
                case "right":
                    return i.y === start.y && i.x > start.x;
                case "up":
                    return i.x === start.x && i.y < start.y;
                case "down":
                    return i.x === start.x && i.y > start.y;
            }
        })
        .sort((a, b) => {
            switch (direction) {
                case "left":
                case "right":
                    return Math.abs(a.x - start.x) - Math.abs(b.x - start.x);
                case "up":
                case "down":
                    return Math.abs(a.y - start.y) - Math.abs(b.y - start.y);
            }
        })[0] ?? null;
}