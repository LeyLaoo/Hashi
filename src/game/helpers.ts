import { seg } from "./geometry";
import type { Bridge, Direction, GameState, Island, IslandState } from "./types";

export function simplifyBridge(bridge: Bridge) {
    if (bridge.from.id < bridge.to.id) {
        return bridge;
    } else {
        return {
            from: bridge.to,
            to: bridge.from,
            count: bridge.count,
        };
    }
}

export function bridgeToSeg(bridge: Bridge) {
    return seg(bridge.from, bridge.to);
}

function getIslandBridgeAmount(islandId: number, bridges: Bridge[]): number {
    return bridges.reduce((sum, b) => {
        if (b.from.id === islandId || b.to.id === islandId) {
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
        graph.get(b.from.id)?.add(b.to.id);
        graph.get(b.to.id)?.add(b.from.id);
    }

    return graph;
}

export function isFullyConnected(islands: Island[], bridges: Bridge[]): boolean {
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

export function getCandidateIsland(state: GameState, originalIsland: Island, mouseX: number, mouseY: number): Island | null {
    if (mouseX < -0.5 || mouseY < -0.5 || mouseX > state.width - 0.5 || mouseY > state.height - 0.5) return null;
    if (originalIsland.x < mouseX) {
        if (Math.abs(originalIsland.x - mouseX) > Math.abs(originalIsland.y - mouseY)) {
            return findNextIsland(state, originalIsland, "right");
        } else if (originalIsland.y < mouseY) {
            return findNextIsland(state, originalIsland, "down");
        } else {
            return findNextIsland(state, originalIsland, "up");
        }
    } else {
        if (Math.abs(originalIsland.x - mouseX) > Math.abs(originalIsland.y - mouseY)) {
            return findNextIsland(state, originalIsland, "left");
        } else if (originalIsland.y < mouseY) {
            return findNextIsland(state, originalIsland, "down");
        } else {
            return findNextIsland(state, originalIsland, "up");
        }
    }
}

function findNextIsland(state: GameState, start: Island, direction: Direction): Island | null {
    const islandMap = new Map(state.islands.map((i) => [`${i.x},${i.y}`, i]));
    return findNextIslandMap(islandMap, start, direction, state.width, state.height);
}

function findNextIslandMap(islandMap: Map<string, Island>, start: Island, direction: Direction, boardWidth: number, boardHeight: number): Island | null {
    let x = start.x;
    let y = start.y;

    while (true) {
        switch (direction) {
            case "left":
                x--;
                break;
            case "right":
                x++;
                break;
            case "up":
                y--;
                break;
            case "down":
                y++;
                break;
        }

        const island = islandMap.get(`${x},${y}`);
        if (island) return island;

        if (x > boardWidth || x < 0 || y < 0 || y > boardHeight) return null;
    }
}

export function getBridgeAtPosition(mouseX: number, mouseY: number, bridges: Bridge[]): Bridge | null {
    return bridges.find((b) => isPointOnBridge(mouseX, mouseY, b)) ?? null;
}

function isPointOnBridge(mouseX: number, mouseY: number, bridge: Bridge): boolean {
    const HITBOX = 0.2;

    const [a, b] = getBridgeEndpoints(bridge);

    if (a.y === b.y) {
        // horizontal
        return Math.abs(mouseY - a.y) <= HITBOX && mouseX >= Math.min(a.x, b.x) && mouseX <= Math.max(a.x, b.x);
    }

    // vertical
    return Math.abs(mouseX - a.x) <= HITBOX && mouseY >= Math.min(a.y, b.y) && mouseY <= Math.max(a.y, b.y);
}

function getBridgeEndpoints(bridge: Bridge): [{ x: number; y: number }, { x: number; y: number }] {
    return [
        { x: bridge.from.x, y: bridge.from.y },
        { x: bridge.to.x, y: bridge.to.y },
    ];
}

export function getIslandOnPosition(mouseX: number, mouseY: number, islands: Island[]): Island | null {
    return islands.find((i) => isPointOnIsland(mouseX, mouseY, i)) ?? null;
}

function isPointOnIsland(mouseX: number, mouseY: number, island: Island): boolean {
    const HITBOX = 0.5;

    return Math.abs(mouseX - island.x) < HITBOX && Math.abs(mouseY - island.y) < HITBOX;
}
