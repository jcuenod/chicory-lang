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

    enterTailExpr(ctx: parser.TailExprContext) {
        // we handle these individually as named expressions
    }

    enterLiteralExpr(ctx: parser.LiteralExprContext) {
        this.output += ctx.getText();
    }

    enterIdentifierExpr(ctx: parser.IdentifierExprContext) {
        this.output += ctx.getText();
    }

    enterOperation(ctx: parser.OperationContext) {
        this.output += " " + ctx.OPERATOR().getText() + " ";
    } 

    enterMemberExpr(ctx: parser.MemberExprContext) {
        this.output += "." + ctx.IDENTIFIER().getText();
    } 

    enterIndexExpr(ctx: parser.IndexExprContext) {
        this.output += "["
    }
    exitIndexExpr(ctx: parser.IndexExprContext) {
        this.output += "]"
    }



    visitTerminal(){}
    visitErrorNode(){}
    enterEveryRule(){}
    exitEveryRule(){}

    getOutput(){
        return this.output;
    }
}