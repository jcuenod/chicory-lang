import { expect, test } from "bun:test";
import compile from "../compile";

test("assign jsx element with attributes and text child", () => {
  const { code } = compile(`let x = <div className="yo" id={4 + 5}>
    hi
</div>`);
  expect(code).toBe(`let x = <div className="yo" id={4+5}>hi</div>;`);
});

test("assign self-closing jsx element with attributes", () => {
  const { code } = compile(`let y = <div className="yo" id={4 + 5} />`);
  expect(code).toBe(`let y = <div className="yo" id={4+5} />;`);
});

test("assign jsx element with attributes and children of jsx elements, an expression, and a string", () => {
  const { code } = compile(`let z = <div className="yo" id={4 + 5}>
    <h1>yo</h1>
    <h2>yo</h2>
    {4 + 5}
    string
</div>`);
  expect(code).toBe(`let z = <div className="yo" id={4+5}><h1>yo</h1><h2>yo</h2>{4 + 5}string</div>;`);
});
