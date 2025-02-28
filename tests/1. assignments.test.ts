import { expect, test } from "bun:test";
import compile from "../compile";

test("let assign number", () => {
  const { code } = compile("let a = 1");
  expect(code).toBe("let a = 1;");
});

test("const assign number", () => {
  const { code } = compile("const b = 20");
  expect(code).toBe("const b = 20;");
});

test("let assign float", () => {
  const { code } = compile("let c = 3.14");
  expect(code).toBe("let c = 3.14;");
});

test("const assign string", () => {
  const { code } = compile(`const d = "hello"`);
  expect(code).toBe(`const d = "hello";`);
});

test("let assign boolean", () => {
  const { code } = compile("let e = true");
  expect(code).toBe("let e = true;");
});
