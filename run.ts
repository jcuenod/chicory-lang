import compile from "./compile"

const args = Bun.argv.slice(2)?.[0]
if (!args) {
  console.error("No file specified")
  process.exit(1)
}

const file = Bun.file(args);
const source = await file.text();

const compiled = compile(source)

// write to temp file:
await Bun.write("/tmp/compiled.js", compiled)
// run the compiled file:
const {stdout} = Bun.spawn(["bun", "run", "/tmp/compiled.js"], {
    stdout: "inherit"
})