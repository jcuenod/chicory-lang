import { CharStream, CommonTokenStream, ParseTreeWalker } from 'antlr4ng';
import { ChicoryLexer } from './generated/ChicoryLexer';
import { ChicoryParser } from './generated/ChicoryParser';
import { ChicoryParserListener } from './ChicoryListener';

const listener = new ChicoryParserListener();

const chicory_code = `
let a = 1
const b = 20
let c = 3.14
const d = "hello"
let e = true
`;

let inputStream = CharStream.fromString(chicory_code);
let lexer = new ChicoryLexer(inputStream);
let tokenStream = new CommonTokenStream(lexer);
let parser = new ChicoryParser(tokenStream);
let tree = parser.program();

ParseTreeWalker.DEFAULT.walk(listener, tree);

console.log(listener.getOutput());