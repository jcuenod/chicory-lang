import compile from "./compile";

const yellowBoldTermPrefix = "\x1b[33m\x1b[1m";
const resetStyle = "\x1b[0m";
const yellow = (str) => yellowBoldTermPrefix + str + resetStyle;

const args = Bun.argv.slice(2)?.[0];
if (!args) {
  console.error("No file specified");
  process.exit(1);
}

const file = Bun.file(args);
const source = await file.text();

console.log(yellow(" ⚡ Compiling Chicory Source ⚡"));
const { code, errors } = compile(source) || { code: "", errors: [] };
errors.forEach((error, index) => {
  console.error(
    `\nError ${index}:\n${JSON.stringify(error.range.start)}\n${JSON.stringify(
      error.message
    )}\n`
  );
});

console.log(yellow(" ⚡ Executing ⚡"));

// run the compiled code:
const proc = Bun.spawn(["bun", "run", "-"], {
  stdin: "pipe",
  stdout: "inherit",
});
proc.stdin.write(code);
proc.stdin.end();
