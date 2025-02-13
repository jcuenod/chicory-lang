grammar Chicory;

program
    : NL* stmt (NL* stmt)* NL* EOF
    ;

stmt
    : assignStmt
    | expr
    ;

assignStmt
    : assignKwd IDENTIFIER '=' expr
    ;

expr: primaryExpr tailExpr*; 

primaryExpr
    : ifExpr            #IfElseExpr
    | IDENTIFIER        #IdentifierExpr
    | literal           #LiteralExpr
    ;

tailExpr
    : '.' IDENTIFIER    #MemberExpr
    | '[' expr ']'      #IndexExpr
    | OPERATOR expr     #Operation
    ;

ifExpr
    : justIfExpr                                            #BareIfExpr
    | justIfExpr ('else' blockExpr)                         #IfWithElseExpr
    | justIfExpr ('else' justIfExpr)* 'else' justIfExpr     #IfElseIfExpr
    | justIfExpr ('else' justIfExpr)* ('else' blockExpr)    #IfWithElseExpr
    ;

justIfExpr
    : 'if' '(' expr ')' blockExpr
    ;

blockExpr
    : '{' NL* stmt (NL* stmt)* NL* expr? NL* '}'
    ;

assignKwd
    : LET_KWD
    | CONST_KWD
    ;

literal
    : STRING
    | NUMBER
    | TRUE_KWD | FALSE_KWD
    ;



// LEXING

LET_KWD: 'let';
CONST_KWD: 'const';
TRUE_KWD: 'true';
FALSE_KWD: 'false';

IDENTIFIER: [a-zA-Z_][a-zA-Z0-9_]*;

OPERATOR: '+' | '-' | '*' | '/' | '==' | '!=';

// TODO: Handle escaping
STRING: '"' (~["\n])* '"';

NUMBER: [0-9]+ ('.' [0-9]+)?;

NL: '\n';
WS: [ \r\n\t]+ -> channel(HIDDEN);