import { expect, test } from "bun:test";
import compile from "../compile";

test("if expr with else block", () => {
  const { code } = compile(`let x = if (a == 2) {
    let y = 1
    "asdf"
} else { 4 }`);

  expect(code).toBe(`let x = (a == 2) ? (() => {
    let y = 1;
    return "asdf";
})() : (() => {
    return 4;
})();`);
});

test("if expr without else block", () => {
  const { code } = compile(`if (a == 2) {
    let x = 3
    x * 2
}`);

  expect(code).toBe(`(a == 2) ? (() => {
    let x = 3;
    return x * 2;
})() : undefined;`);
});

test("ternary-like if expr", () => {
  const { code } = compile(`if (b == 1) "one" else "other"`);

  expect(code).toBe(`(b == 1) ? (() => { return "one"; })() : (() => { return "other"; })();`);
});