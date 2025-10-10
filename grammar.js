/**
 * @file Ponos grammar for tree-sitter
 * @author Gaidar <garius642@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  call: 8,
  field: 7,
  unary: 6,
  multiplicative: 5,
  additive: 4,
  comparative: 3,
  and: 2,
  or: 1,
  closure: 0
}

module.exports = grammar({
  name: "ponos",

  extras: ($) => [
    /\s/, // whitespace
    $.comment,
  ],

  rules: {
    source_file: $ => repeat($._statement),

    comment: ($) =>
      token(
        choice(seq("//", /.*/)),
      ),

    _statement: $ => choice(
      $.var_statement,
      $.return_statement,
      $.function_declaration_statement,
      $.assigment_statement,
      $.if_statement,
      $.while_statement,
      $.expression_statement,
      $.class_declaration_statement
    ),

    var_statement: $ => seq(
      "пер",
      $.identifier,
      "=",
      $._expression,
      ";"
    ),

    return_statement: $ => seq(
      "возврат",
      optional($._expression),
      ";"
    ),

    function_declaration_statement: $ => seq(
      "функ",
      $.identifier,
      $.params_list,
      repeat($._statement),
      "конец"
    ),

    params_list: $ => seq(
      "(",
      sepBy(",", $.identifier),
      ")"
    ),

    assigment_statement: $ => seq(
      $.identifier,
      "=",
      $._expression,
      ";"
    ),

    if_statement: $ => seq(
      "если",
      $._expression,
      repeat($._statement),
      optional(seq("иначе", repeat($._statement))),
      "конец"
    ),

    while_statement: $ => seq(
      "пока",
      $._expression,
      repeat($._statement),
      "конец"
    ),

    class_declaration_statement: $ => seq(
      "класс",
      $.identifier,
      optional(seq("наследует", $.identifier)),
      optional(seq("реализует", $.identifier)),
      optional($.members_list),
      "конец"
    ),

    members_list: $ => repeat1(
      choice(
        $.function_declaration_statement,
        $.identifier
      )
    ),

    expression_statement: $ => seq(
      $._expression,
      ";"
    ),

    _expression: $ => choice(
      $.call_expression,
      $._literal,
      prec.left($.identifier),
      $.unary_expression,
      $.binary_expression,
      $.closure_expression,
      $.field_expression
    ),

    unary_expression: $ => prec(
      PREC.unary,
      choice(
        seq("-", $._expression),
        seq("!", $._expression),
      ),
    ),

    binary_expression: $ => choice(
      prec.left(PREC.multiplicative, seq($._expression, choice('*', '/'), $._expression)),
      prec.left(PREC.additive, seq($._expression, choice('+', '-'), $._expression)),
      prec.left(PREC.comparative, seq($._expression, choice('<', '<=', '>', '>='), $._expression)),
      prec.left(PREC.and, seq($._expression, 'и', $._expression)),
      prec.left(PREC.or, seq($._expression, 'или', $._expression)),
    ),

    call_expression: $ => prec(PREC.call, seq($._expression, $.arguments)),

    field_expression: $ => prec(PREC.field, seq(
      $._expression,
      ".",
      $.identifier
    )),

    arguments: $ => seq(
      '(',
      sepBy(',', seq($._expression)),
      optional(','),
      ')',
    ),

    closure_expression: $ => prec(PREC.closure, seq(
      "функ",
      $.params_list,
      repeat($._statement),
      "конец"
    )),

    identifier: $ => /[\p{XID_Start}_][\p{XID_Continue}_]*/,

    _literal: $ => choice(
      $.number,
      $.bool,
      $.string,
    ),

    number: $ => /[0-9]+(\.[0-9]+)?/,

    bool: $ => choice(
      "истина",
      "ложь"
    ),

    string: $ => seq(
      '"',
      repeat(choice(
        /[^"\\\n]/,        // любой символ кроме кавычки, бэкслэша и перевода строки
        /\\./              // escape-последовательности
      )),
      '"'
    )

  }
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
