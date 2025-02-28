import { expect, test } from "bun:test";
import compile from "../compile";

test("call with member expression", () => {
  const { code } = compile(`a.b(c)`);
  expect(code).toBe(`a.b(c);`);
});

test("anonymous function call", () => {
  const { code } = compile(`((str) => str)("hi")`);
  expect(code).toBe(`((str) => str)("hi");`);
});

test("call a function with a param expression and call a member expressions on the result", () => {
  const { code } = compile(`myFunc(asdf * 3)[3].yo(4)`);
  expect(code).toBe(`myFunc(asdf * 3)[3].yo(4);`);
});