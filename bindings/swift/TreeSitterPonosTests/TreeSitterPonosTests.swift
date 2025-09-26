import XCTest
import SwiftTreeSitter
import TreeSitterPonos

final class TreeSitterPonosTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_ponos())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Ponos grammar")
    }
}
