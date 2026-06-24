export const CELL_SIZE = 60;
export const OFFSET = CELL_SIZE / 2;

export function gridToScreen(x: number, y: number) {
    return {
        x: x * CELL_SIZE + OFFSET,
        y: y * CELL_SIZE + OFFSET,
    };
}

export function screenToGrid(mouseX: number, mouseY: number) {
    return {
        x: Math.round((mouseX - OFFSET) / CELL_SIZE),
        y: Math.round((mouseY - OFFSET) / CELL_SIZE),
    };
}