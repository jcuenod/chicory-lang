# 🐣 Chicory

> caffeine-free javascript

Chicory is a functional-friendly javascript alternative that compiles to JSX.

```chicory
let hello = (name) =>
  match (name) {
    "world" => <h1>Hello, WORLD!</h1>,
    _ => <h1>Hello, {name}!</h1>,
  }

hello("world")      // "Hello, WORLD!"
hello("Chicory")    // "Hello, Chicory!"
```

## Features

- If expressions
- Match expressions for pattern matching
- Algebraic data types
- JSX support and compiles to JSX

## Eventual Goals

- Performant JS
- Readable compiled JSX (? maybe this is not a goal)
- Excellent interop story with the JS ecosystem

## TODO

- [ ] Vite plugin
- [ ] Documentation
- [ ] Language features (it's only a PoC right now)
- [ ] Hindley-Milner type inference
- [ ] Type checking
- [ ] Syntax highlighting (so, probably a tree-sitter implementation)
