;; Comments
(comment) @comment

;; Literals
(string) @string
(number) @number
(bool) @boolean

;; Types and declarations
(type_annotation (identifier) @type)
(class_declaration (identifier) @type)
(interface_declaration (identifier) @type)
(annotation_declaration (identifier) @type)
(function_declaration (identifier) @function)
(method_signature (identifier) @function)
(constructor_declaration) @keyword
(var_statement (identifier) @variable)

;; Keywords via structured nodes
(var_statement "пер" @keyword)
(function_declaration "функ" @keyword)
(class_declaration "класс" @keyword)
(interface_declaration "интерфейс" @keyword)
(annotation_declaration "аннотация" @keyword)
(import_statement ["использовать" "как"] @keyword)
(class_declaration ["наследует" "реализует"] @keyword)
(if_statement ["если" "иначе"] @keyword)
(while_statement "пока" @keyword)
(try_statement ["попытка" "перехват"] @keyword)
(throw_statement "исключение" @keyword)
(return_statement "возврат" @keyword)
(lambda_expression "функ" @keyword)
(this_expression) @keyword
(super_expression) @keyword

;; Operators
(binary_expression ["+" "-" "*" "/" "%" "==" "!=" "<" "<=" ">" ">=" "и" "или"] @operator)
(unary_expression ["-" "!"] @operator)

;; Properties and calls
(field_expression (identifier) @property)
(call_expression (primary_expression (identifier) @function.call))

;; Brackets/parens
(index_expression "[" @punctuation.bracket "]" @punctuation.bracket)
(array_literal ["[" "]"] @punctuation.bracket)
(dict_literal ["{" "}"] @punctuation.bracket)
(arguments ["(" ")"] @punctuation.bracket)
(parenthesized_expression ["(" ")"] @punctuation.bracket)
