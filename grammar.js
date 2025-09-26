/**
 * @file Ponos grammar for tree-sitter
 * @author Gaidar <garius642@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "ponos",

  extras: ($) => [
    /\s/, // whitespace
    $.comment,
  ],

  rules: {
    source_file: $ => repeat($.statement),
    
    comment: ($) =>
      token(
        choice(seq("//", /.*/)),
      ),

    statement: $ => choice (
      $.var_statement,
      $.return_statement,
      $.function_declaration,
      $.assigment_statement,
      $.if_statement,
      $.while_statement,
      $.expression_statement
    ),

    var_statement: $ => seq(
      "пер",
      $.identifier,
      "=",
      $.expression,
      ";"
    ),

    return_statement: $ => seq(
      "возврат",
      optional($.expression),
      ";"
    ),

    function_declaration: $ => seq(
      "функ",
      $.identifier,
      "(",
      optional($.params_list),
      ")",
      repeat($.statement),
      "конец"
    ),

    params_list: $ => seq(
      $.identifier,
      optional(repeat(seq(",", $.identifier)))
    ),

    assigment_statement: $ => seq(
      $.identifier,
      "=",
      $.expression,
      ";"
    ),

    if_statement: $ => seq(
      "если",
      $.expression,
      repeat($.statement),
      optional(seq("иначе", repeat($.statement))),
      "конец"
    ),
    
    while_statement: $ => seq(
      "пока",
      $.expression,
      repeat($.statement),
      "конец"
    ),

    expression_statement: $ => seq(
      $.expression,
      ";"
    ),
    
    expression: $ => choice(
      $._literal,
      $.identifier,
      $.unary_expression,
      $.binary_expression
    ),

    unary_expression: $ => prec(
      5,
      choice(
        seq("-", $.expression),
        seq("!", $.expression),
      ),
    ),
    

    binary_expression: $ => choice(
      prec.left(4, seq($.expression, choice('*', '/'), $.expression)),
      prec.left(3, seq($.expression, choice('+', '-'), $.expression)),
      prec.left(2, seq($.expression, choice('<', '<=', '>', '>='), $.expression)),
      prec.left(1, seq($.expression, choice('и', 'или'), $.expression)),
    ),

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
