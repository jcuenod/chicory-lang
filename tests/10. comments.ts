export const source = `
let a = 1
// test comment
let b = 2
// another
// test
let c = 3
/*
  test
  comment
*/
let d = 4

// let e = 6
/* beginning of the line */ let /* something here */ f /* something else here */ = /* something else else here */ 7 // eol stuff
`

export const compiled = `
let a = 1;
let b = 2;
let c = 3;
let d = 4;
let f = 7;
`