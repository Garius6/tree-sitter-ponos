/**
 * Ponos grammar for tree-sitter
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  call: 9,
  field: 9,
  index: 9,
  unary: 8,
  multiplicative: 7,
  additive: 6,
  comparison: 5,
  equality: 4,
  and: 3,
  or: 2,
  closure: 1,
};

module.exports = grammar({
  name: "ponos",

  extras: ($) => [
    /\s/,
    $.comment,
  ],

  conflicts: ($) => [
    [$.parenthesized_expression, $.arguments],
    [$.try_statement, $.primary_expression],
  ],

  rules: {
    source_file: ($) => repeat($._statement),

    comment: ($) =>
      token(
        choice(/\/\/[^\n]*/, /\/\*[\s\S]*?\*\//),
      ),

    _statement: ($) =>
      choice(
        $.import_statement,
        $.class_declaration,
        $.interface_declaration,
        $.annotation_declaration,
        $.var_statement,
        $.function_declaration,
        $.try_statement,
        $.throw_statement,
        $.if_statement,
        $.while_statement,
        $.return_statement,
        $.assignment_statement,
        $.expression_statement,
      ),

    import_statement: ($) =>
      seq(
        "использовать",
        $.string,
        optional(seq("как", $.identifier)),
        ";",
      ),

    var_statement: ($) =>
      seq(
        optional("экспорт"),
        "пер",
        $.identifier,
        optional($.type_annotation),
        optional(seq("=", $._expression)),
        ";",
      ),

    return_statement: ($) => seq("возврат", optional($._expression), ";"),

    function_declaration: ($) =>
      seq(
        optional("экспорт"),
        "функ",
        $.identifier,
        $.params_list,
        optional($.type_annotation),
        repeat($._statement),
        "конец",
      ),

    params_list: ($) => seq("(", sepBy(",", $.parameter), ")"),

    parameter: ($) => seq($.identifier, optional($.type_annotation)),

    assignment_statement: ($) =>
      seq(
        choice($.identifier, $.field_expression, $.index_expression),
        "=",
        $._expression,
        ";",
      ),

    if_statement: ($) =>
      seq(
        "если",
        $._expression,
        repeat($._statement),
        optional(seq("иначе", repeat($._statement))),
        "конец",
      ),

    while_statement: ($) => seq("пока", $._expression, repeat($._statement), "конец"),

    try_statement: ($) =>
      seq(
        "попытка",
        repeat($._statement),
        "перехват",
        optional($.identifier),
        repeat($._statement),
        "конец",
      ),

    throw_statement: ($) => seq("исключение", $._expression, ";"),

    class_declaration: ($) =>
      seq(
        optional("экспорт"),
        "класс",
        $.identifier,
        optional(seq("наследует", $.identifier)),
        optional(seq("реализует", sepBy1(",", $.identifier))),
        repeat($.class_member),
        "конец",
      ),

    class_member: ($) =>
      choice($.constructor_declaration, $.function_declaration, $.field_declaration),

    field_declaration: ($) => seq($.identifier, optional($.type_annotation), optional(";")),

    constructor_declaration: ($) =>
      seq("конструктор", $.params_list, repeat($._statement), "конец"),

    interface_declaration: ($) =>
      seq(
        optional("экспорт"),
        "интерфейс",
        $.identifier,
        repeat($.method_signature),
        "конец",
      ),

    method_signature: ($) => seq("функ", $.identifier, $.params_list, ";"),

    annotation_declaration: ($) =>
      seq(optional("экспорт"), "аннотация", $.identifier, repeat($._statement), "конец"),

    expression_statement: ($) => seq($._expression, ";"),

    _expression: ($) =>
      choice(
        $.lambda_expression,
        $.binary_expression,
        $.unary_expression,
        $.call_expression,
        $.field_expression,
        $.index_expression,
        $.primary_expression,
      ),

    unary_expression: ($) =>
      prec(
        PREC.unary,
        seq(choice("-", "!"), $._expression),
      ),

    binary_expression: ($) =>
      choice(
        prec.left(PREC.or, seq($._expression, "или", $._expression)),
        prec.left(PREC.and, seq($._expression, "и", $._expression)),
        prec.left(PREC.equality, seq($._expression, choice("==", "!="), $._expression)),
        prec.left(
          PREC.comparison,
          seq($._expression, choice("<", "<=", ">", ">="), $._expression),
        ),
        prec.left(PREC.additive, seq($._expression, choice("+", "-"), $._expression)),
        prec.left(PREC.multiplicative, seq($._expression, choice("*", "/", "%"), $._expression)),
      ),

    call_expression: ($) => prec.left(PREC.call, seq($._expression, $.arguments)),

    field_expression: ($) => prec.left(PREC.field, seq($._expression, ".", $.identifier)),

    index_expression: ($) =>
      prec.left(
        PREC.index,
        seq($._expression, "[", choice($.slice, $._expression), "]"),
      ),

    slice: ($) => seq(optional($._expression), ":", optional($._expression)),

    lambda_expression: ($) =>
      prec(
        PREC.closure,
        seq(
          "функ",
          $.params_list,
          optional($.type_annotation),
          repeat($._statement),
          "конец",
        ),
      ),

    primary_expression: ($) =>
      choice(
        $.array_literal,
        $.dict_literal,
        $.number,
        $.bool,
        $.string,
        $.this_expression,
        $.super_expression,
        $.identifier,
        $.parenthesized_expression,
      ),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    array_literal: ($) => seq("[", sepBy(",", $._expression), "]"),

    dict_literal: ($) => seq("{", sepBy(",", $.dict_pair), "}"),

    dict_pair: ($) => seq($._expression, ":", $._expression),

    this_expression: ($) => "это",

    super_expression: ($) => seq("родитель", ".", $.identifier),

    arguments: ($) => seq("(", sepBy(",", $._expression), ")"),

    identifier: ($) => /[\p{XID_Start}_][\p{XID_Continue}_]*/,

    type_annotation: ($) => seq(":", $.identifier),

    number: ($) => /[0-9]+(\.[0-9]+)?/,

    bool: ($) => choice("истина", "ложь"),

    string: ($) =>
      seq(
        '"',
        repeat(choice(/[^"\\\n]/, /\\./)),
        '"',
      ),
  },
});

/**
 * Creates a rule to match one or more of the rules separated by the separator.
 *
 * @param {RuleOrLiteral} sep - The separator to use.
 * @param {RuleOrLiteral} rule
 *
 * @returns {SeqRule}
 */
function sepBy1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}

/**
 * Creates a rule to optionally match one or more of the rules separated by the separator.
 *
 * @param {RuleOrLiteral} sep - The separator to use.
 * @param {RuleOrLiteral} rule
 *
 * @returns {ChoiceRule}
 */
function sepBy(sep, rule) {
  return optional(sepBy1(sep, rule));
}
