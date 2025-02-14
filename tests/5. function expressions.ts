export const source = `
() => {
 let a = 1
 if (a) { "1" } else { "2" }
}
`

export const compiled = `
() => {
    let a = 1;
    return (a) ? (() => {
        return "1";
    })() : (() => {
        return "2";
    })();
};
`