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
