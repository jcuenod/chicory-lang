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
    : '(' expr ')'      #ParenExpression
    | ifExpr            #IfExpression
    | funcExpr          #FunctionExpression
    | matchExpr         #MatchExpression
    | IDENTIFIER        #IdentifierExpression
    | literal           #LiteralExpression
    ;

tailExpr
    : '.' IDENTIFIER    #MemberExpression
    | '[' expr ']'      #IndexExpression
    | callExpr          #CallExpression
    | OPERATOR expr     #OperationExpression
    ;

ifExpr: justIfExpr ('else' justIfExpr)* ('else' blockExpr)?;

justIfExpr
    : 'if' '(' expr ')' blockExpr
    ;

funcExpr
    : '(' NL* parameterList? NL* ')' '=>' blockExpr
    ;

parameterList
    : IDENTIFIER (',' IDENTIFIER)*
    ;

callExpr
    : '(' NL* (expr (',' NL* expr)*)? NL* ')'
    ;

matchExpr
    : 'match' '(' expr ')' '{' NL* matchArm (',' NL* matchArm)* ','? NL* '}'
    ;

matchArm
    : matchPattern '=>' blockExpr
    ;

matchPattern
    : IDENTIFIER                    #BareAdtMatchPattern
    | IDENTIFIER '(' IDENTIFIER ')' #AdtWithParamMatchPattern
    | IDENTIFIER '(' literal ')'    #AdtWithLiteralMatchPattern
    | '_'                           #WildcardMatchPattern
    | literal                       #LiteralMatchPattern
    ;

blockExpr
    : '{' NL* stmt (NL* stmt)* NL* '}'
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