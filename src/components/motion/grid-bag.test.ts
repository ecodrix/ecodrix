/** Run: npx tsx --test src/components/motion/grid-bag.test.ts (no test runner is installed in this repo). */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { crossings, inRects, makeBag, pad } from "./grid-bag";

describe("makeBag", () => {
  it("never repeats until the bag is empty, over many rounds", () => {
    const items = Array.from({ length: 37 }, (_, i) => i);
    const bag = makeBag(items);
    for (let round = 0; round < 20; round++) {
      const seen = new Set<number>();
      for (let i = 0; i < items.length; i++) {
        const v = bag.next() as number;
        assert.ok(!seen.has(v), `repeat ${v} in round ${round}`);
        seen.add(v);
      }
      assert.equal(seen.size, items.length);
    }
  });
  it("does not repeat across the reshuffle seam", () => {
    const bag = makeBag([1, 2, 3], () => 0);
    let prev = bag.next();
    for (let i = 0; i < 30; i++) {
      const v = bag.next();
      assert.notEqual(v, prev);
      prev = v;
    }
  });
  it("empty and single-item bags are safe", () => {
    assert.equal(makeBag([]).next(), undefined);
    assert.equal(makeBag(["a"]).next(), "a");
  });
});

describe("grid", () => {
  it("builds crossings and filters avoid rects", () => {
    const pts = crossings(200, 130, 64);
    assert.equal(pts.length, 4 * 3);
    const r = pad({ l: 60, t: 60, r: 70, b: 70 }, 10);
    assert.ok(inRects({ x: 64, y: 64 }, [r]));
    assert.ok(!inRects({ x: 192, y: 128 }, [r]));
  });
});
