import { ParserRuleContext } from 'antlr4ng';
import * as parser from './generated/ChicoryParser';
import { ChicoryVisitor } from './generated/ChicoryVisitor';

export class ChicoryParserVisitor {
    private indentLevel: number = 0;

    indent() {
        return "    ".repeat(this.indentLevel);
    }

    visitProgram(ctx: parser.ProgramContext) {
        // a program is a list of stmts
        return ctx.stmt().map(stmt => this.visitStmt(stmt)).join("\n");
    }

    visitStmt(ctx: parser.StmtContext) {
        // A stmt could be an assignment or an expression
        if (ctx.assignStmt()) {
            return this.visitAssignStmt(ctx.assignStmt()!) + ";";
        } else if (ctx.expr()) {
            return this.visitExpr(ctx.expr()!) + ";";
        }
        throw new Error("Unknown stmt type");
    }

    visitAssignStmt(ctx: parser.AssignStmtContext){
        const assignKwd = ctx.assignKwd().getText(); // let or const
        const identifier = ctx.IDENTIFIER().getText();
        return assignKwd + " " + identifier + ' = ' + this.visitExpr(ctx.expr()!);
    }

    visitExpr(ctx: parser.ExprContext) {
        let primary = this.visitPrimaryExpr(ctx.primaryExpr());
        for (const tailExpr of ctx.tailExpr()) {
            primary += this.visitTailExpr(tailExpr);
        }
        return primary;
    }

    visitTailExpr(ctx: parser.TailExprContext) {
        if (ctx.ruleContext instanceof parser.MemberExprContext) {
            return this.visitMemberExpr(ctx as parser.MemberExprContext);
        } else if (ctx.ruleContext instanceof parser.IndexExprContext) {
            return this.visitIndexExpr(ctx as parser.IndexExprContext);
        } else if (ctx.ruleContext instanceof parser.OperationContext) {
            return this.visitOperation(ctx as parser.OperationContext);
        }
        throw new Error("Unknown tail expression type");
    }

    visitMemberExpr(ctx: parser.MemberExprContext) {
        return '.' + ctx.IDENTIFIER().getText();
    }

    visitIndexExpr(ctx: parser.IndexExprContext) {
        return '[' + this.visitExpr(ctx.expr()!) + ']';
    }

    visitOperation(ctx: parser.OperationContext) {
        return " " + ctx.OPERATOR().getText() + " " + this.visitExpr(ctx.expr()!);
    }
    
    visitPrimaryExpr(ctx: parser.PrimaryExprContext) {
        const child = ctx.getChild(0);
        if (child instanceof parser.IfExprContext) {
            return this.visitIfElseExpr(child);
        }
        else if (child instanceof parser.FuncExprContext) {
            return this.visitFuncExpr(child);
        }
        else if (ctx.ruleContext instanceof parser.IdentifierExprContext) {
            return this.visitIdentifier(child);
        } 
        else if (child instanceof parser.LiteralContext) {
            return this.visitLiteral(child);
        }
        throw new Error("Unknown primary expression type");
    }

    // we will compile if expressions to ternary expressions with iife blocks
    visitIfElseExpr(ctx: parser.IfExprContext) {
        const ifs = ctx.justIfExpr().map(justIf => this.visitIfExpr(justIf));
        const elseExpr = ctx.blockExpr() ? this.visitBlockExpr(ctx.blockExpr()!, true) : null;
        return ifs.join("") + (elseExpr ? `(() => ${elseExpr})()` : "undefined");
    }

    visitIfExpr(ctx: parser.JustIfExprContext) {
        const condition = this.visitExpr(ctx.expr());
        const block = this.visitBlockExpr(ctx.blockExpr(), true);
        return `(${condition}) ? (() => ${block})() : `;
    }

    visitFuncExpr(ctx: parser.FuncExprContext) {
        const params = ctx.parameterList() ? this.visitParameterList(ctx.parameterList()!) : "";
        const block = this.visitBlockExpr(ctx.blockExpr(), true);
        return `(${params}) => ${block}`;
    }

    visitParameterList(ctx: parser.ParameterListContext) {
        return ctx.IDENTIFIER().map(id => id.getText()).join(", ");
    }

    visitBlockExpr(ctx: parser.BlockExprContext, returnLastExpr = false) {
        this.indentLevel++;
        const stmts = ctx.stmt();
        if (stmts.length === 0) {
            return "";
        }

        const block = stmts.map(stmt => this.indent() + this.visitStmt(stmt));      
        if (stmts[stmts.length - 1].expr() instanceof parser.ExprContext && returnLastExpr) {
            block.pop();
            const finalExpr = this.visitExpr(stmts[stmts.length - 1].expr()!);
            block.push(this.indent() + `return ${finalExpr};`);
        }
        this.indentLevel--;
        return "{\n" + block.join("\n") + "\n" + this.indent() + "}";
    }

    visitIdentifier(ctx) {
        return ctx.getText();
    }

    visitLiteral(ctx: parser.LiteralContext) {
        return ctx.getText();
    }

    getOutput(ctx: parser.ProgramContext) {
        return this.visitProgram(ctx);
    }
}