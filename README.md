# 🐣 Chicory

> caffeine-free javascript

Chicory is a functional-friendly type-safe Javascript alternative that compiles to JSX.

```chicory
import { document } from "bindings/browser"
import React from "bindings/react"
import ReactDOM from "bindings/react-dom"

const Hello = (name) =>
  match (name) {
    "world" => <h1>Hello, WORLD!</h1>,
    _ => <h1>Hello, {name}!</h1>,
  }

ReactDOM.render(
  <Hello name="world" />,
  document.getElementById("root")
)
```

## Why

A "type-safe alternative to JS" sounds a lot like "typescript". If you've ever refactored a JS project, you probably wished you were using TS. But if you've ever refactored a TS project, you know that it's not as safe as you would like. Not only do `any` and `as` litter your codebase, but `null` and `undefined` still flow through the type system. Chicory aims to be a better alternative to both JS and TS. It's what TS could have been if it didn't try to support all of JS.

Chicory is not as extensive as TS and doesn't aim to support all of JS. Instead, it aims to be familiar to JS developers so that there's an easy onramp. But all the footguns are gone, so you know your code will work if it compiles. Because it compiles to JSX, you can use your build system, libraries and tools, and you can run it on your favorite JS runtime.

## Features

- If expressions
- Match expressions for pattern matching
- Algebraic data types
- JSX support and compiles to JSX

## Goals

- Performant JS
- Readable compiled JSX (? maybe this is not a goal)
- Easy bindings to JS libraries
- JS FFI?

## TODO

- [ ] Vite plugin
- [ ] Documentation
- [ ] Language features (it's only a PoC right now)
- [ ] Hindley-Milner type inference
- [ ] Type checking
- [ ] Syntax highlighting (so, probably a tree-sitter implementation)
