import { expect, test } from "bun:test";
import compile from "../compile";

test("function expr", () => {
  const { code } = compile(`() => {
 let a = 1
 if (a) { "1" } else { "2" }
}`);
  expect(code).toBe(`() => {
    let a = 1;
    return (a) ? (() => {
        return "1";
    })() : (() => {
        return "2";
    })();
};`);
});