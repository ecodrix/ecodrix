/** Pure helpers for GridSparks: grid crossings, the no-repeat shuffled bag, avoid-rect test. */

export type Pt = { x: number; y: number };
export type Rect = { l: number; t: number; r: number; b: number };

/** Every "+" of a cell grid anchored at the band's top-left corner (0,0 included, far edges excluded). */
export function crossings(w: number, h: number, cell: number): Pt[] {
  const out: Pt[] = [];
  for (let y = 0; y < h; y += cell) for (let x = 0; x < w; x += cell) out.push({ x, y });
  return out;
}

export function inRects(p: Pt, rects: Rect[]): boolean {
  return rects.some((q) => p.x >= q.l && p.x <= q.r && p.y >= q.t && p.y <= q.b);
}

/** Pad a DOM rect by `pad` on every side. */
export const pad = (q: Rect, n: number): Rect => ({ l: q.l - n, t: q.t - n, r: q.r + n, b: q.b + n });

/**
 * A shuffled bag: next() never repeats an item until all have been drawn, then reshuffles.
 * The first draw after a reshuffle never equals the last draw of the previous round (when length > 1).
 */
export function makeBag<T>(items: readonly T[], rand: () => number = Math.random) {
  let bag: T[] = [];
  let last: T | undefined;
  const refill = () => {
    bag = items.slice();
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    if (bag.length > 1 && bag[bag.length - 1] === last) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
  };
  return {
    /** Draws left in the current round. */
    get left() {
      return bag.length;
    },
    next(): T | undefined {
      if (items.length === 0) return undefined;
      if (bag.length === 0) refill();
      last = bag.pop();
      return last;
    },
  };
}
