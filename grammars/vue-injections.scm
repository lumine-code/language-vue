; TypeScript also parses JavaScript expressions and the SFC's TS expressions.
((interpolation
  (raw_text) @injection.content) @injection.owner
  (#set! injection.language "typescript"))

((directive_attribute
  [
    (quoted_attribute_value (attribute_value) @injection.content)
    (attribute_value) @injection.content
  ]) @injection.owner
  (#set! injection.language "typescript"))

; Annotation candidates are filtered by the target grammar.
((comment) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((comment) @injection.owner @injection.content
  (#set! injection.language "todo")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((attribute
  [
    (attribute_value) @injection.owner @injection.content
    (quoted_attribute_value (attribute_value) @injection.owner @injection.content)
  ])
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none"))
