# 🐣 Chicory

> caffeine-free javascript

Chicory is a functional-friendly javascript alternative that compiles to JSX.

```chicory
let hello = (name) => {
  match (name) {
    "world" => { "Hello, WORLD!" },
    _ => { "Hello, " + name + "!" }
  }
}

hello("world")      // "Hello, WORLD!"
hello("Chicory")    // "Hello, Chicory!"
```

## Features

- If expressions
- Match expressions for pattern matching
- Algebraic data types
- JSX support and compiles to JSX

## TODO

- [ ] Documentation
- [ ] Language features (it's only a PoC right now)
- [ ] Hindley-Milner type inference
- [ ] Type checking
- [ ] Syntax highlighting (so, probably a tree-sitter implementation)
