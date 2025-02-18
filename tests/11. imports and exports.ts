export const source = `
import React from "react"
import { Component } from "somewhere/something"
import Something, { somethingElse, yetAnotherThing } from "somewhere/else"
export { x, y, z }
`

export const compiled = `
import React from "react";
import { Component } from "somewhere/something";
import Something, { somethingElse, yetAnotherThing } from "somewhere/else";
export { x, y, z };
`