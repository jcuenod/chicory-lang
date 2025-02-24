import compile from "./compile";

const tests = [
    './tests/1. assignments',
    './tests/2. operations',
    './tests/3. member expressions',
    './tests/4. if expressions',
    './tests/5. function expressions',
    './tests/6. match expressions',
    './tests/7. call expressions',
    './tests/8. jsx expressions',
    './tests/9. type definitions',
    './tests/10. comments',
    './tests/11. imports and exports',
]

tests.forEach(async path => {
    const {source, compiled} = await import(path)
    
    console.log(`Running test: ${path}`);
    const { code } = compile(source) || { code: "", errors: [] };

    if (code.trim() === compiled.trim()){
        console.log(' - Test passed\n');
    }
    else {
        console.log(' - Test failed');
        console.log(' - Expected:');
        console.log(compiled);
        console.log(' - Got:');
        console.log(code + '\n');
    }
})
