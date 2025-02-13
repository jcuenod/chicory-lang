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
    : IDENTIFIER        #IdentifierExpr
    | literal           #LiteralExpr
    ;

tailExpr
    : '.' IDENTIFIER    #MemberExpr
    | '[' expr ']'      #IndexExpr
    | OPERATOR expr     #Operation
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