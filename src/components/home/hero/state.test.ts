/** Run: npx tsx --test src/components/home/hero/state.test.ts */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { initialState, reduce } from "./state";

describe("hero inbox panes (small frames show one at a time)", () => {
  it("starts on the list", () => assert.equal(initialState().pane, "list"));
  it("a scripted select opens the chat, with no visitor flag", () => {
    const s = reduce(initialState(), { type: "script", a: { t: "select", id: "ps" }, at: 0 });
    assert.equal(s.pane, "chat");
    assert.equal(s.sel, "ps");
    assert.equal(s.visitor, false);
  });
  it("a visitor tap opens the chat; Back and Customer move between panes", () => {
    let s = reduce(initialState(), { type: "select", id: "ps" });
    assert.equal(s.pane, "chat");
    s = reduce(s, { type: "pane", pane: "card" });
    assert.equal(s.pane, "card");
    s = reduce(s, { type: "pane", pane: "list" });
    assert.equal(s.pane, "list");
    assert.equal(s.visitor, true);
  });
  it("the story loop restarts on the list", () => {
    let s = reduce(initialState(), { type: "select", id: "ps" });
    s = reduce(s, { type: "script", a: { t: "reset" }, at: 0 });
    assert.equal(s.pane, "list");
  });
});
