import {
    CharStream,
    CommonTokenStream,
    ParserRuleContext,
    TerminalNode,
} from 'antlr4ng';
import * as parser from './generated/ChicoryParser.js';
import { ChicoryLexer } from './generated/ChicoryLexer.js';

abstract class ASTNode { }

class ProgramNode extends ASTNode {
    constructor(public statements: StatementNode[]) {
        super();
    }
}

abstract class StatementNode extends ASTNode { }

class AssignmentNode extends StatementNode {
    public type: 'AssignStmt';
    constructor(
        public isConstant: boolean,
        public identifier: string,
        public expression: ExpressionNode
    ) {
        super();
        this.type = 'AssignStmt';
    }
}

class ExpressionStatementNode extends StatementNode {
    public type: 'ExprStmt';
    constructor(public expression: ExpressionNode) {
        super();
        this.type = 'ExprStmt';
    }
}


abstract class ExpressionNode extends ASTNode {}

class IdentifierNode extends ExpressionNode {
    public type: 'Identifier';
    constructor(public identifier: string) {
        super();
        this.type = 'Identifier';
    }
}

class LiteralNode extends ExpressionNode {
    public type: 'Literal';
    constructor(public value: string | number | boolean, public kind: 'string' | 'number' | 'boolean') {
        super();
        this.type = 'Literal';
    }
}

class IfNode extends ExpressionNode {
    public type: 'IfNode';
    constructor(public condition: ExpressionNode, public thenBlock: BlockExpressionNode) {
        super();
        this.type = 'IfNode';
    }
}

class IfExpressionNode extends ExpressionNode {
    public type: 'IfExpr';
    constructor(public ifNode: IfNode, public elseIfNodes: IfNode[], public elseBlock?: BlockExpressionNode) {
        super();
        this.type = 'IfExpr';
    }
}

class BlockExpressionNode extends ExpressionNode {
    public type: 'BlockExpr';
    constructor(public statements: StatementNode[], public returnValue?: ExpressionNode) {
        super();
        this.type = 'BlockExpr';
    }
}

class MemberAccessNode extends ExpressionNode {
    public type: 'MemberAccess';
    constructor(public object: ExpressionNode, public property: string) {
        super();
        this.type = 'MemberAccess';
    }
}

class IndexAccessNode extends ExpressionNode {
    public type: 'IndexAccess';
    constructor(public object: ExpressionNode, public index: ExpressionNode) {
        super();
        this.type = 'IndexAccess';
    }
}

class OperationNode extends ExpressionNode {
    public type: 'Operation';
    constructor(public operator: string, public left: ExpressionNode, public right: ExpressionNode) {
        super();
        this.type = 'Operation';
    }
}



// --- AST Builder (Visitor) ---

class ASTBuilder {

    visitProgram(ctx: parser.ProgramContext): ProgramNode {
        const statements: StatementNode[] = [];
        for (const stmtCtx of ctx.stmt()) {
            statements.push(this.visitStmt(stmtCtx) as StatementNode);
        }
        return new ProgramNode(statements);
    }

    visitStmt(ctx: parser.StmtContext): StatementNode {
        if (ctx.assignStmt()) {
            return this.visitAssignStmt(ctx.assignStmt()!) as AssignmentNode;
        }
        else if (ctx.expr()) {
          return new ExpressionStatementNode(this.visitExpr(ctx.expr()!) as ExpressionNode);
        } else {
            throw new Error("Unreachable statement type");
        }
    }

    visitAssignStmt(ctx: parser.AssignStmtContext): AssignmentNode {
        const isConstant = ctx.assignKwd()!.getText() === 'const';
        const identifier = ctx.IDENTIFIER()!.getText();
        const expression = this.visitExpr(ctx.expr()!) as ExpressionNode;
        return new AssignmentNode(isConstant, identifier, expression);
    }

    visitExpr(ctx: parser.ExprContext): ExpressionNode {
        let primary: ExpressionNode = this.visitPrimaryExpr(ctx.primaryExpr()!) as ExpressionNode;
        for(const tail of ctx.tailExpr())
        {
            const tailResult = this.visitTailExpr(tail);
            if (tail.ruleContext instanceof parser.OperationContext) {
                (tailResult as OperationNode).left = primary;
                primary = tailResult;
            }
            else if (tail.ruleContext instanceof parser.MemberExprContext) {
                (tailResult as MemberAccessNode).object = primary;
                primary = tailResult;
            }
            else if (tail.ruleContext instanceof parser.IndexExprContext) {
                (tailResult as IndexAccessNode).object = primary;
                primary = tailResult;
            } else {
                throw new Error("Unexpected Tail expression type.");
            }
        }
        return primary;
    }


    visitPrimaryExpr(ctx: parser.PrimaryExprContext): ExpressionNode {
        if(ctx instanceof parser.IdentifierExprContext) {
            return new IdentifierNode(ctx.IDENTIFIER()!.getText());
        }
        else if (ctx instanceof parser.LiteralExprContext) {
            return this.visitLiteral(ctx.literal()!);
        }
        else if (ctx instanceof parser.IfElseExprContext) {
            return this.visitIfExpr(ctx.ifExpr()!);
        }
        else {
            throw new Error("Unknown primary expression type");
        }
    }


    visitTailExpr(ctx: parser.TailExprContext): ExpressionNode {
        if(ctx instanceof parser.MemberExprContext) {
            return new MemberAccessNode(null!, ctx.IDENTIFIER()!.getText()); //Object filled in later.
        }
        else if (ctx instanceof parser.IndexExprContext) {
            return new IndexAccessNode(null!, this.visitExpr(ctx.expr()!) as ExpressionNode); //object filled in later
        }
        else if (ctx instanceof parser.OperationContext) {
            return new OperationNode(ctx.OPERATOR()!.getText(), null!, this.visitExpr(ctx.expr()!) as ExpressionNode); // left filled in later
        }
        else {
            throw new Error("Unknown tail expression type");
        }
    }



    visitIfExpr(ctx: parser.IfExprContext): IfExpressionNode {
        const justIfExprs = ctx.justIfExpr()
        const ifNode = this.visitJustIf(justIfExprs[0]!) as IfNode;

        const elseIfNodes = justIfExprs.slice(1).map(justIfExpr => this.visitJustIf(justIfExpr!) as IfNode);
        
        const elseBlock = ctx.blockExpr() ? this.visitBlockExpr(ctx.blockExpr()!) : undefined
     
        return new IfExpressionNode(
            ifNode,
            elseIfNodes,
            elseBlock
        );
    }

    visitJustIf(ctx: parser.JustIfExprContext): IfNode {
        return new IfNode(this.visitExpr(ctx.expr()), this.visitBlockExpr(ctx.blockExpr()!) as BlockExpressionNode);
    }

    visitBlockExpr(ctx: parser.BlockExprContext): BlockExpressionNode {
        const statements: StatementNode[] = [];
        for (const stmtCtx of ctx.stmt()) {
            statements.push(this.visitStmt(stmtCtx) as StatementNode);
        }

        let returnValue: ExpressionNode | undefined;
        if(ctx.expr())
        {
            returnValue = this.visitExpr(ctx.expr()!) as ExpressionNode;
        }
        return new BlockExpressionNode(statements, returnValue);
    }


    visitLiteral(ctx: ParserRuleContext): LiteralNode {
        const terminal = ctx.getChild(0) as TerminalNode;
        const text = terminal.getText();

        switch (terminal.symbol.type) {
            case parser.ChicoryParser.STRING:
                return new LiteralNode(text.slice(1, -1), 'string'); // Remove quotes
            case parser.ChicoryParser.NUMBER:
                return new LiteralNode(parseFloat(text), 'number');
            case parser.ChicoryParser.TRUE_KWD:
                return new LiteralNode(true, 'boolean');
            case parser.ChicoryParser.FALSE_KWD:
                return new LiteralNode(false, 'boolean');
            default:
                throw new Error(`Unknown literal type: ${text}`);
        }
    }
}

// --- Example Usage ---

import * as Cparser from './generated/ChicoryParser.js';
export function parseAndBuildAST(input: string): ProgramNode {
    const astBuilder = new ASTBuilder();
    const charStream = CharStream.fromString(input);
    const lexer = new ChicoryLexer(charStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new Cparser.ChicoryParser(tokenStream);
    const parseTree = parser.program();
    return astBuilder.visitProgram(parseTree);
}