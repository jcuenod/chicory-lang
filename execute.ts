import compile from "./compile"

const yellowBoldTermPrefix = '\x1b[33m\x1b[1m';
const resetStyle = '\x1b[0m';
const yellow = (str) => yellowBoldTermPrefix + str + resetStyle;


const args = Bun.argv.slice(2)?.[0]
if (!args) {
  console.error("No file specified")
  process.exit(1)
}

const file = Bun.file(args);
const source = await file.text();

console.log(yellow(" ⚡ Compiling Chicory code (see /tmp/compiled.js) ⚡"))
const {code, errors} = compile(source) || {code: "", errors: []}
errors.forEach((error,index) => {
  console.error(`\nError ${index}:\n${JSON.stringify(error.range.start)}\n${JSON.stringify(error.message)}\n`)
})
 
console.log(yellow(" ⚡ Executing ⚡"))

// write to temp file:
await Bun.write("/tmp/compiled.js", code)
// run the compiled file:
const {stdout} = Bun.spawn(["bun", "run", "/tmp/compiled.js"], {
    stdout: "inherit"
})