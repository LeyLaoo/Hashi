import { getBridgeAtPosition } from "./helpers";
import type { Bridge, Direction, GameState, Island } from "./types";
import { canConnect } from "./validation";

export function generatePuzzle(width: number, height: number, islandCount: number): GameState {
    const islands: Island[] = [];
    const bridges: Bridge[] = [];
    const gameState: GameState = {
        width,
        height,
        islands,
        bridges,
        allConnectionHintShown: false
    };

    islands.push({
        id: islands.length,
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        value: 0,
    });

    let tries = 0;

    while (islands.length < islandCount) {
        if(tries > islandCount*20) break;
        const from = randomElement(islands);
        const direction = randomDirection();

        const position = findPosition(from, direction, islands, width, height);
        tries++;

        if (!position) continue;
        if (!canConnect(from, { id: 99999, x: position.x, y: position.y, value: 1 }, gameState)) continue;
        if (getBridgeAtPosition(position.x, position.y, gameState.bridges)) continue;
        if (isIslandAdjacent(gameState, position)) continue;

        const newIsland: Island = {
            id: islands.length,
            x: position.x,
            y: position.y,
            value: 0,
        };

        islands.push(newIsland);

        bridges.push({
            from: from,
            to: newIsland,
            count: 1,
        });
    }

    for (const bridge of bridges) if (Math.random() < 0.3) bridge.count = 2;

    assignIslandValues(islands, bridges);

    return {
        ...gameState,
        bridges: [],
    };
}

function findPosition(island: Island, direction: Direction, islands: Island[], width: number, height: number) {
    const distance = Math.floor(Math.random() * 3) + 2;

    let x = island.x;
    let y = island.y;

    switch (direction) {
        case "up":
            y -= distance;
            break;

        case "down":
            y += distance;
            break;

        case "left":
            x -= distance;
            break;

        case "right":
            x += distance;
            break;
    }

    if (x < 0 || x >= width || y < 0 || y >= height) return null;

    if (islands.some((i) => i.x === x && i.y === y)) return null;

    return { x, y };
}

function assignIslandValues(islands: Island[], bridges: Bridge[]) {
    for (const island of islands) {
        island.value = bridges.filter((b) => b.from.id === island.id || b.to.id === island.id).reduce((sum, b) => sum + b.count, 0);
    }
}

function randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function randomDirection(): Direction {
    const directions: Direction[] = ["up", "down", "left", "right"];
    return randomElement(directions);
}

function isIslandAdjacent(state: GameState, position: { x: number; y: number }): boolean {
    return (
        state.islands.filter(
            (i) =>
                (i.x == position.x && position.y - 1 <= i.y && i.y <= position.y + 1) || (i.y == position.y && position.x - 1 <= i.x && i.x <= position.x + 1),
        ).length > 0
    );
}
