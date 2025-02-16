import { ParserRuleContext } from 'antlr4ng';
import * as parser from './generated/ChicoryParser';
import { ChicoryVisitor } from './generated/ChicoryVisitor';

let i = 0;
const getUniqueChicoryVariableName = () => `__chicory_var_${i++}`;

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
        }
        else if (ctx.typeDefinition()) {
            // NOTE: we erase types from js, but we will need to visit to handle type-checking...
            return ""
        }
        else if (ctx.expr()) {
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
        if (ctx.ruleContext instanceof parser.MemberExpressionContext) {
            return this.visitMemberExpr(ctx as parser.MemberExpressionContext);
        }
        else if (ctx.ruleContext instanceof parser.IndexExpressionContext) {
            return this.visitIndexExpr(ctx as parser.IndexExpressionContext);
        }
        else if (ctx.ruleContext instanceof parser.CallExpressionContext) {
            return this.visitCallExpr((ctx as parser.CallExpressionContext).callExpr());
        }
        else if (ctx.ruleContext instanceof parser.OperationExpressionContext) {
            return this.visitOperation(ctx as parser.OperationExpressionContext);
        }
        throw new Error("Unknown tail expression type");
    }

    visitMemberExpr(ctx: parser.MemberExpressionContext) {
        return '.' + ctx.IDENTIFIER().getText();
    }

    visitIndexExpr(ctx: parser.IndexExpressionContext) {
        return '[' + this.visitExpr(ctx.expr()!) + ']';
    }

    visitOperation(ctx: parser.OperationExpressionContext) {
        return " " + ctx.OPERATOR().getText() + " " + this.visitExpr(ctx.expr()!);
    }
    
    visitPrimaryExpr(ctx: parser.PrimaryExprContext) {
        const child = ctx.getChild(0);
        if (ctx instanceof parser.ParenExpressionContext) {
            return '(' + this.visitExpr((ctx as parser.ParenExpressionContext).expr()) + ')';
        }
        else if (child instanceof parser.IfExprContext) {
            return this.visitIfElseExpr(child);
        }
        else if (child instanceof parser.FuncExprContext) {
            return this.visitFuncExpr(child);
        }
        else if (child instanceof parser.JsxExprContext) {
            return this.visitJsxExpr(child);
        }
        else if (child instanceof parser.MatchExprContext) {
            return this.visitMatchExpr(child);
        }
        else if (ctx.ruleContext instanceof parser.IdentifierExpressionContext) {
            return this.visitIdentifier(child);
        } 
        else if (child instanceof parser.LiteralContext) {
            return this.visitLiteral(child);
        }
        console.log(ctx.ruleContext);
        console.log(child);
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

    visitCallExpr(ctx: parser.CallExprContext) {
        const args = ctx.expr() 
            ? ctx.expr()!.map(expr => this.visitExpr(expr)).join(", ")
            : "";
        return `(${args})`;
    }

    visitMatchExpr(ctx: parser.MatchExprContext) {
        this.indentLevel++;
        const expr = this.visitExpr(ctx.expr());
        // TODO: explore passing the expression straight through, if it's just an identifier...
        const varName = getUniqueChicoryVariableName();
        const matchExpr = this.indent() + `const ${varName} = ${expr};`

        const arms = ctx.matchArm().map((arm, i) => this.indent() + (i>0?"else ":"") + this.visitMatchArm(arm, varName));
        const body = [
            matchExpr,
            ...arms
        ]
        this.indentLevel--;
        return `(() => {\n${body.join("\n")}\n${this.indent()}})()`;
    }

    visitMatchArm(ctx: parser.MatchArmContext, varName: string) {
        const {pattern, inject} = this.visitPattern(ctx.matchPattern(), varName);
        const block = this.visitBlockExpr(ctx.blockExpr(), true, inject);
        return `if (${pattern}) ${block}`;
    }

    visitPattern(ctx: parser.MatchPatternContext, varName: string) {
        if (ctx.ruleContext instanceof parser.BareAdtMatchPatternContext) {
            const adtName = (ctx as parser.BareAdtMatchPatternContext).IDENTIFIER().getText();
            return { pattern: `${varName}.type === "${adtName}"` };
        } else if (ctx.ruleContext instanceof parser.AdtWithParamMatchPatternContext) {
            const [adtName, paramName] = (ctx as parser.AdtWithParamMatchPatternContext).IDENTIFIER().map(id => id.getText());
            return { 
                pattern: `${varName}.type === "${adtName}"`,
                inject: `const ${paramName} = ${varName}.value`
            };
        } else if (ctx.ruleContext instanceof parser.AdtWithLiteralMatchPatternContext) {
            const adtName = (ctx as parser.AdtWithLiteralMatchPatternContext).IDENTIFIER().getText();
            const literalValue = this.visitLiteral((ctx as parser.AdtWithLiteralMatchPatternContext).literal())
            return { pattern:`${varName}.type === "${adtName}" && ${varName}.value === ${literalValue}` };
        } else if (ctx.ruleContext instanceof parser.WildcardMatchPatternContext) {
            return { pattern: "true" };
        } else if (ctx.ruleContext instanceof parser.LiteralMatchPatternContext) {
            const literalValue = this.visitLiteral((ctx as parser.AdtWithLiteralMatchPatternContext).literal())
            return { pattern: `${varName} === ${literalValue}` };
        }
        throw new Error("Unknown match arm pattern type");
    }

    visitBlockExpr(ctx: parser.BlockExprContext, returnLastExpr = false, inject = "") {
        this.indentLevel++;
        const stmts = ctx.stmt();
        if (stmts.length === 0) {
            return "";
        }

        const block = inject ? [this.indent() + inject] : []; 
        block.push(...stmts.map(stmt => this.indent() + this.visitStmt(stmt)));     
        if (stmts[stmts.length - 1].expr() instanceof parser.ExprContext && returnLastExpr) {
            block.pop();
            const finalExpr = this.visitExpr(stmts[stmts.length - 1].expr()!);
            block.push(this.indent() + `return ${finalExpr};`);
        }
        this.indentLevel--;
        return "{\n" + block.join("\n") + "\n" + this.indent() + "}";
    }

    visitJsxExpr(ctx: parser.JsxExprContext) {
        if (ctx.jsxSelfClosingElement()) {
            return this.visitJsxSelfClosingElement(ctx.jsxSelfClosingElement()!);
        }
        const opening = this.visitJsxOpeningElement(ctx.jsxOpeningElement()!);
        const children = ctx.jsxChild().map(child => this.visitJsxChild(child)).join("");
        const closing = this.visitJsxClosingElement(ctx.jsxClosingElement()!);
        return `${opening}${children}${closing}`;
    }

    visitJsxSelfClosingElement(ctx: parser.JsxSelfClosingElementContext) {
        const tag = ctx.IDENTIFIER().getText();
        const attrs = ctx.jsxAttributes() ? this.visitJsxAttributes(ctx.jsxAttributes()!) : "";
        return `<${tag}${attrs} />`;
    }

    visitJsxOpeningElement(ctx: parser.JsxOpeningElementContext) {
        const tag = ctx.IDENTIFIER().getText();
        const attrs = ctx.jsxAttributes() ? this.visitJsxAttributes(ctx.jsxAttributes()!) : "";
        return `<${tag}${attrs}>`;
    }

    visitJsxClosingElement(ctx: parser.JsxClosingElementContext) {
        const tag = ctx.IDENTIFIER().getText();
        return `</${tag}>`;
    }

    visitJsxAttributes(ctx: parser.JsxAttributesContext) {
        return ctx.jsxAttribute().map(attr => this.visitJsxAttribute(attr)).join("");
    }

    visitJsxAttribute(ctx: parser.JsxAttributeContext) {
        const name = ctx.IDENTIFIER().getText();
        const value = ctx.jsxAttributeValue() ? this.visitJsxAttributeValue(ctx.jsxAttributeValue()!) : "";
        return ` ${name}=${value}`;
    }

    visitJsxAttributeValue(ctx: parser.JsxAttributeValueContext) {
        return ctx.getText();
    }

    visitJsxChild(ctx: parser.JsxChildContext) {
        if (ctx instanceof parser.JsxChildJsxContext) {
            return this.visitJsxExpr(ctx.jsxExpr());
        }
        else if (ctx instanceof parser.JsxChildExpressionContext) {
            return "{" + this.visitExpr(ctx.expr()) + "}";
        }
        else if (ctx instanceof parser.JsxChildTextContext) {
            return ctx.getText().trim();
        }
        throw new Error("Unknown JsxChildContext type");
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