import { ParserRuleContext } from 'antlr4ng';
import * as parser from './generated/ChicoryParser';
import { ChicoryListener } from './generated/ChicoryListener';

export class ChicoryParserListener implements ChicoryListener {
    private output: string = '';

    exitStmt(ctx: parser.StmtContext) {
        this.output += ';\n';
    }

    enterAssignStmt(ctx: parser.AssignStmtContext){
        const assignKwd = ctx.assignKwd().getText();
        const identifier = ctx.IDENTIFIER().getText();
        this.output += assignKwd + " " + identifier + ' = ';
    }

    enterLiteral(ctx: parser.LiteralContext){
        const literal = ctx.getText();
        this.output += literal;
    }

    enterOperation(ctx: parser.OperationContext){
        this.output += " " + ctx.getText() + " ";
    }

    visitTerminal(){}
    visitErrorNode(){}
    enterEveryRule(){}
    exitEveryRule(){}

    getOutput(){
        return this.output;
    }
}