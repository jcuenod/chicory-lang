export const source = `
match (a) {
    None => { "nothing" },
    Some(42) => { "forty two" },
    Some(x) => {
        if (x == 10) {
            "ten"
        } else {
            "small"
        }
    }
}
match (b) {
    "hi" => { "hello" },
    "bye" => { "goodbye" },
    _ => { "what?" }
}
`

export const compiled = `
(() => {
    const __chicory_var_0 = a;
    if (__chicory_var_0.type === "None") {
        return "nothing";
    }
    else if (__chicory_var_0.type === "Some" && __chicory_var_0.value === 42) {
        return "forty two";
    }
    else if (__chicory_var_0.type === "Some") {
        const x = __chicory_var_0.value
        return (x == 10) ? (() => {
            return "ten";
        })() : (() => {
            return "small";
        })();
    }
})();
(() => {
    const __chicory_var_1 = b;
    if (__chicory_var_1 === "hi") {
        return "hello";
    }
    else if (__chicory_var_1 === "bye") {
        return "goodbye";
    }
    else if (true) {
        return "what?";
    }
})();
`