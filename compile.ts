import { CharStream, CommonTokenStream, ParserRuleContext, ParseTreeWalker, TokenStream } from 'antlr4ng';
import { ChicoryLexer } from './generated/ChicoryLexer';
import { ChicoryParser } from './generated/ChicoryParser';
import { ChicoryParserVisitor } from './ChicoryVisitor';

const getRange = (ctx: ParserRuleContext, tokenStream: TokenStream) => {
    const {start, stop} = ctx.getSourceInterval()
    const startToken = tokenStream.get(start)
    const stopToken = tokenStream.get(stop)
    return {
        start: { line: startToken.line - 1, character: startToken.column },
        end: { line: stopToken.line - 1, character: stopToken.column + (stopToken.text?.length || 1) }
    }
}

const compilerErrorToLspError = tokenStream => (e => ({
    severity: 1, // 1 is error
    message: e.message,
    range: getRange(e.context, tokenStream),
    source: "chicory",
}))

export default (source: string) => {
    if (!source.trim()) {
        return { code: "", errors: [] }
    }
    let inputStream = CharStream.fromString(source);
    let lexer = new ChicoryLexer(inputStream);
    let tokenStream = new CommonTokenStream(lexer);
    let parser = new ChicoryParser(tokenStream);
    let tree = parser.program();
    
    const visitor = new ChicoryParserVisitor();
    const {code, errors: unprocessedErrors} = visitor.getOutput(tree) || {code: "", errors: []}

    const mapErrors = compilerErrorToLspError(tokenStream)
    const errors = unprocessedErrors.map(mapErrors)

    return {
        code,
        errors
    }
}
