import { expect, test } from "bun:test";
import compile from "../compile";

test("let assign number", () => {
  const { code } = compile(`type MyPrimitiveType = string`);
  expect(code).toBe(``);
});

test("let assign number", () => {
  const { code } = compile(`type MyRecord = {
  name: str,
  age: int,
}`);
  expect(code).toBe(``);
});

test("let assign number", () => {
  const { code } = compile(`type MyTuple = [int, str, Person]`);
  expect(code).toBe(``);
});

test("let assign number", () => {
  const { code } = compile(`type MyEnum = Option1 | Option2 | Option3`);
  expect(code).toBe(``);
});

test("let assign number", () => {
  const { code } = compile(`type MyAdt = 
    | ValueA(string)
    | ValueB({width: number, height: number})
    | ValueD`);
  expect(code).toBe(``);
});