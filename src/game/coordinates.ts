export var cellSize = 60;

export function setCellSize(newSize: number){
    cellSize = newSize
}

// export const [cellSize, setCellSize] = useState(60);

export function getSVGCoordinates(e: React.PointerEvent<SVGElement>): { x: number; y: number } {
    const svg = e.currentTarget instanceof SVGSVGElement ? e.currentTarget : e.currentTarget.ownerSVGElement;

    if (!svg) throw new Error("No SVG found");

    const point = svg.createSVGPoint();

    point.x = e.clientX;
    point.y = e.clientY;

    const transformed = point.matrixTransform(svg.getScreenCTM()?.inverse());

    return toHashiCoordinates(transformed.x, transformed.y);
}

export function toHashiCoordinates(x: number, y: number): { x: number; y: number } {
    return { x: (x + cellSize/2) / cellSize -1, y: (y + cellSize/2) / cellSize-1 };
}
