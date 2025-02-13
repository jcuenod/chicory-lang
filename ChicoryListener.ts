import { ParserRuleContext } from 'antlr4ng';
import * as parser from './generated/ChicoryParser';
import { ChicoryListener } from './generated/ChicoryListener';

export class ChicoryParserListener implements ChicoryListener {
    private output: string = '';
    private indentLevel: number = 0;

    indent() {
        return "    ".repeat(this.indentLevel);
    }

    exitStmt(ctx: parser.StmtContext) {
        this.output += ';\n';
    }

    enterExpr(ctx: parser.ExprContext) {
        // if this expr is a stmt and it's the last child of a block and the block is a child of an if, then we need to insert a `return`
        if (ctx.parent instanceof parser.StmtContext &&
            ctx.parent.parent instanceof parser.BlockExprContext && 
            (ctx.parent.parent.parent instanceof parser.IfExprContext || ctx.parent.parent.parent instanceof parser.JustIfExprContext) && 
            ctx.parent.parent.parent.children.indexOf(ctx.parent.parent) === ctx.parent.parent.parent.children.length - 1
        ) {
            this.output += "return "
        }
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

    enterBlockExpr(ctx: parser.BlockExprContext) {
        this.indentLevel++;
        // handle blocks that are part of if expressions
        if (ctx.parent instanceof parser.JustIfExprContext || ctx.parent instanceof parser.IfExprContext) {
            if (ctx.parent instanceof parser.JustIfExprContext) {
                this.output += " ? "
            }
            this.output += "(() => {\n" + this.indent()
        } else {
            this.output += "{\n" + this.indent()
        }
    }
    exitBlockExpr(ctx: parser.BlockExprContext) {
        this.indentLevel--;
        // handle blocks that are part of if expressions
        if (ctx.parent instanceof parser.JustIfExprContext || ctx.parent instanceof parser.IfExprContext) {
            this.output += this.indent() + "})()"
            if (ctx.parent instanceof parser.JustIfExprContext) {
                this.output += " : "
                // if this block is a child of a JustIfExpr and that JustIfExpr is the last child its parent, then we need to add a dummy else block
                if (ctx.parent instanceof parser.JustIfExprContext && ctx.parent.parent instanceof parser.IfExprContext && ctx.parent.parent.children.indexOf(ctx.parent) === ctx.parent.parent.children.length - 1) {
                    this.output += "undefined"
                }
            }
        } else {
            this.output += this.indent() + "}\n" + this.indent()
        }
    }



    visitTerminal(){}
    visitErrorNode(){}
    enterEveryRule(){}
    exitEveryRule(){}

    getOutput(){
        return this.output;
    }
}