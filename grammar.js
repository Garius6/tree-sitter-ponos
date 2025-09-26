/**
 * @file Ponos grammar for tree-sitter
 * @author Gaidar <garius642@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "ponos",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
