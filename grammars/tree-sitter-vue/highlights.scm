; Vue's own nodes. `html-highlights.scm` loads first and covers everything
; tree-sitter-vue inherits from tree-sitter-html; this file only adds what is
; Vue's.
;
; The shapes come from the grammar itself:
;
;   directive_attribute := ( directive_name (":" (directive_value | dynamic_directive_value))?
;                          | ((":" | "." | "@" | "#") (directive_value | dynamic_directive_value))+ )
;                          directive_modifiers?
;                          ("=" (attribute_value | quoted_attribute_value))?
;
; so `v-if` is a `directive_name`, while the name after a `:`/`@`/`#`/`.`
; shorthand is a `directive_value` and is told apart only by the token in front
; of it. `directive_attribute` holds no `attribute_name`, so none of the HTML
; attribute rules fire inside one.


; DIRECTIVES
; ==========

; `v-if`, `v-for`, `v-model`, `v-bind`…
(directive_attribute
  (directive_name) @entity.other.attribute-name.directive.vue)

; The shorthand sigils, and the `.` that introduces a modifier.
(directive_attribute
  [":" "@" "#" "."] @punctuation.definition.directive.vue)

; `:title="…"` and `v-bind:title="…"` — the bound attribute or prop.
(directive_attribute
  ":" .
  (directive_value) @entity.other.attribute-name.binding.vue)

; `@click="…"` — the event.
(directive_attribute
  "@" .
  (directive_value) @entity.other.attribute-name.event.vue)

; `#default="…"` — the slot, in `v-slot` shorthand.
(directive_attribute
  "#" .
  (directive_value) @entity.other.attribute-name.slot.vue)

; `.prop="…"` — the `.prop` modifier shorthand for `v-bind`.
(directive_attribute
  "." .
  (directive_value) @entity.other.attribute-name.prop.vue)

; `:[key]="…"` — the argument is an expression, not a literal name.
(dynamic_directive_value
  "[" @punctuation.definition.directive.begin.bracket.square.vue
  "]" @punctuation.definition.directive.end.bracket.square.vue)

(dynamic_directive_inner_value) @variable.other.dynamic-argument.vue

; `.prevent`, `.stop`, `.once`, `.self`…
(directive_modifiers
  "." @punctuation.definition.modifier.vue)

(directive_modifier) @entity.other.attribute-name.modifier.vue


; INTERPOLATION
; =============

; `{{ count + 1 }}`. The body is injected, so only the delimiters are scoped
; here.
(interpolation
  "{{" @punctuation.section.embedded.begin.vue
  "}}" @punctuation.section.embedded.end.vue)

((interpolation) @meta.embedded.line.vue
  (#set! capture.shy true))


; COMPONENTS
; ==========

; A PascalCase tag is a component rather than an element. Additive: the
; `entity.name.tag.html` fallback in `html-highlights.scm` carries no
; `capture.final`, so a component keeps both scopes and a theme can target
; either.
((tag_name) @entity.name.tag.component.vue
  (#match? @entity.name.tag.component.vue "^[A-Z]"))

; The SFC's own three top-level blocks. `template` is the only one whose tag
; name the HTML rules do not already classify.
(template_element
  (start_tag
    (tag_name) @entity.name.tag.structure._TEXT_.vue))

(template_element
  (end_tag
    (tag_name) @entity.name.tag.structure._TEXT_.vue))
