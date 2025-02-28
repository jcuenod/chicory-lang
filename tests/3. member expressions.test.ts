import { expect, test } from "bun:test";
import compile from "../compile";

test("indexing into records and arrays", () => {
  const { code } = compile(`a.b[2].c.d[1 + "adf"]`);
  expect(code).toBe(`a.b[2].c.d[1 + "adf"];`);
});