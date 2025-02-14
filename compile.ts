import { CharStream, CommonTokenStream, ParseTreeWalker } from 'antlr4ng';
import { ChicoryLexer } from './generated/ChicoryLexer';
import { ChicoryParser } from './generated/ChicoryParser';
import { ChicoryParserVisitor } from './ChicoryVisitor';


export default (source: string) => {
    let inputStream = CharStream.fromString(source);
    let lexer = new ChicoryLexer(inputStream);
    let tokenStream = new CommonTokenStream(lexer);
    let parser = new ChicoryParser(tokenStream);
    let tree = parser.program();
    
    const visitor = new ChicoryParserVisitor();
    return visitor.getOutput(tree);
}
