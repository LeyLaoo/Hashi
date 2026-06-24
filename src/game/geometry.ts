export type Pt = { x: number; y: number };

export type Seg = { a: Pt; b: Pt };

export const seg = (a: Pt, b: Pt): Seg => ({ a, b });

export const isHorizontal = (s: Seg) => s.a.y === s.b.y;
export const isVertical = (s: Seg) => s.a.x === s.b.x;

export function crosses(h: Seg, v: Seg): boolean {
    const [hx1, hx2] = [h.a.x, h.b.x].sort((a, b) => a - b);
    const [vy1, vy2] = [v.a.y, v.b.y].sort((a, b) => a - b);

    return (
        v.a.x > hx1 &&
        v.a.x < hx2 &&
        h.a.y > vy1 &&
        h.a.y < vy2
    );
}