import { expect, test } from "bun:test";
import compile from "../compile";

test("assign records", () => {
  const { code } = compile(`const rec = { a: "one", b: true, c: 3, d: four, }`);
  expect(code).toBe(`const rec = { a: "one", b: true, c: 3, d: four };`);
});

test("assign tuples", () => {
  const { code } = compile(`const tup = ["one", true, 3]`);
  expect(code).toBe(`const tup = ["one", true, 3];`);
});

test("assign arrays", () => {
  const { code } = compile(`const arr = ["one", "two", "three"]`);
  expect(code).toBe(`const arr = ["one", "two", "three"];`);
});

test("return record in if expr", () => {
  const { code } = compile(`if (true) { a: "one", b: true, c: 3, d: four }`);
  expect(code).toBe(
    `(true) ? (() => { return { a: "one", b: true, c: 3, d: four }; })() : undefined;`
  );
});

test("return record in match arm (as expr and as expr in blockExpr)", () => {
  const { code } = compile(`match (str) { 
    "hello" => { a: "one", b: true, c: 3, d: four },
    _ => { { a: "one", b: true, c: 3, d: four } }
}`);

  // note: as an expr in a block expr, we expect newlines...
  expect(code).toBe(`(() => {
    const __chicory_var_0 = str;
    if (__chicory_var_0 === "hello") return { a: "one", b: true, c: 3, d: four };
    else if (true) {
        return { a: "one", b: true, c: 3, d: four };
    }
})();`);
});
