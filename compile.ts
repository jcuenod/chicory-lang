import { CharStream, CommonTokenStream, ParseTreeWalker } from 'antlr4ng';
import { ChicoryLexer } from './generated/ChicoryLexer';
import { ChicoryParser } from './generated/ChicoryParser';
import { ChicoryParserListener } from './ChicoryListener';

const tests = [
    './tests/1. assignments'
]

const listener = new ChicoryParserListener();

tests.forEach(async path => {
    console.log(`Running test: ${path}`);
    const {source, compiled} = await import(path)
    let inputStream = CharStream.fromString(source);
    let lexer = new ChicoryLexer(inputStream);
    let tokenStream = new CommonTokenStream(lexer);
    let parser = new ChicoryParser(tokenStream);
    let tree = parser.program();
    
    ParseTreeWalker.DEFAULT.walk(listener, tree);
    
    const compiledOutput = listener.getOutput();

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
