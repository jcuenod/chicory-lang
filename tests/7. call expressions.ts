export const source = `
a.b(c)
(4 + 5)("hi")
myFunc(asdf * 3)[3].yo(4)
`

export const compiled = `
a.b(c);
(4 + 5)("hi");
myFunc(asdf * 3)[3].yo(4);
`