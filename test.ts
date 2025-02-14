// import compile from "./compile";
import {parseAndBuildAST} from "./AstBuilder";

const tests = [
    './tests/1. assignments',
    './tests/2. operations',
    './tests/3. member expressions',
    './tests/4. if expressions',
    './tests/5. function expressions'
]

tests.forEach(async path => {
    const {source, compiled} = await import(path)
    
    console.log(`Running test: ${path}`);
    const compiledOutput = parseAndBuildAST(source);

    console.log(JSON.stringify(compiledOutput, null, 2));
    // if (compiledOutput.trim() === compiled.trim()){
    //     console.log(' - Test passed\n');
    // }
    // else {
    //     console.log(' - Test failed');
    //     console.log(' - Expected:');
    //     console.log(compiled);
    //     console.log(' - Got:');
    //     console.log(compiledOutput + '\n');
    // }
})
