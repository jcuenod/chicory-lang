import { expect, test } from "bun:test";
import compile from "../compile";

test("primitive type", () => {
  const { code } = compile(`type MyPrimitiveType = string`);
  expect(code).toBe(``);
});

test("record type", () => {
  const { code } = compile(`type MyRecord = {
  name: str,
  age: int,
}`);
  expect(code).toBe(``);
});

test("tuple type", () => {
  const { code } = compile(`type MyTuple = [int, str, Person]`);
  expect(code).toBe(``);
});

test("enum type", () => {
  const { code } = compile(`type MyEnum = Option1 | Option2 | Option3`);
  expect(code).toBe(``);
});

test("adt type", () => {
  const { code } = compile(`type MyAdt = 
    | ValueA(string)
    | ValueB({width: number, height: number})
    | ValueC(SomeType)
    | ValueD`);
  expect(code).toBe(``);
});