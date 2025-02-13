import { CharStream, CommonTokenStream, ParseTreeWalker } from 'antlr4ng';
import { ChicoryLexer } from './generated/ChicoryLexer';
import { ChicoryParser } from './generated/ChicoryParser';
import { ChicoryParserListener } from './ChicoryListener';

const listener = new ChicoryParserListener();

export default (source: string) => {
    let inputStream = CharStream.fromString(source);
    let lexer = new ChicoryLexer(inputStream);
    let tokenStream = new CommonTokenStream(lexer);
    let parser = new ChicoryParser(tokenStream);
    let tree = parser.program();
    
    ParseTreeWalker.DEFAULT.walk(listener, tree);
    
    return listener.getOutput();
}
