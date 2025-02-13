import compile from "./compile";

const tests = [
    './tests/1. assignments'
]

tests.forEach(async path => {
    const {source, compiled} = await import(path)
    
    console.log(`Running test: ${path}`);
    const compiledOutput = compile(source);

    if (compiledOutput.trim() === compiled.trim()){
        console.log(' - Test passed\n');
    }
    else {
        console.log(' - Test failed');
        console.log(' - Expected:');
        console.log(compiled);
        console.log(' - Got:');
        console.log(compiledOutput + '\n');
    }
})
