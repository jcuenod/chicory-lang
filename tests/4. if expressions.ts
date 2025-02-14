export const source = `
let x = if (a == 2) {
    let y = 1
    "asdf"
} else { 4 }

if (a == 2) {
    let x = 3
}
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
})() : undefined;
`