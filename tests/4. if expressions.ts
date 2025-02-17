export const source = `
let x = if (a == 2) {
    let y = 1
    "asdf"
} else { 4 }

if (a == 2) {
    let x = 3
    x * 2
}

if (b == 1) "one" else "other"
`

export const compiled = `
let x = (a == 2) ? (() => {
    let y = 1;
    return "asdf";
})() : (() => {
    return 4;
})();
(a == 2) ? (() => {
    let x = 3;
    return x * 2;
})() : undefined;
(b == 1) ? (() => { return "one" })() : (() => { return "other" })();
`