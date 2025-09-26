package tree_sitter_ponos_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_ponos "github.com/garius6/tree-sitter-ponos/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_ponos.Language())
	if language == nil {
		t.Errorf("Error loading Ponos grammar")
	}
}
