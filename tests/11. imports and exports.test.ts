import { expect, test } from "bun:test";
import compile from "../compile";

test("imports and exports", () => {
  const { code } = compile(`import React from "react"
import { Component } from "somewhere/something"
import Something, { somethingElse, yetAnotherThing } from "somewhere/else"
export { x, y, z }`);
  expect(code).toBe(`import React from "react";
import { Component } from "somewhere/something";
import Something, { somethingElse, yetAnotherThing } from "somewhere/else";
export { x, y, z };`);
});