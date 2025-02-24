import { ParserRuleContext } from "antlr4ng";
import compile from "./compile"

const args = Bun.argv.slice(2)?.[0]
if (!args) {
  console.error("No file specified")
  process.exit(1)
}

const file = Bun.file(args);
const source = await file.text();

const {code, errors} = compile(source) || {code: "", errors: []}
errors.forEach((error,index) => {
  console.error(`Error ${index}:\n${JSON.stringify(error.range.start)}\n${JSON.stringify(error.message)}\n\n`)
})

console.log(code )

// write to temp file:
await Bun.write("/tmp/compiled.js", code)
// run the compiled file:
const {stdout} = Bun.spawn(["bun", "run", "/tmp/compiled.js"], {
    stdout: "inherit"
})