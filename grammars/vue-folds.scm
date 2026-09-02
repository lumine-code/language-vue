; `html-folds.scm` loads first and folds every ordinary element, comment and
; `<script>`/`<style>` block. `template_element` is a node type of Vue's own, so
; none of those patterns reach it.

(template_element) @fold

; A multi-line `{{ … }}` is worth folding on its own.
((interpolation) @fold
  (#set! fold.endAt endPosition)
  (#set! fold.offsetEnd -2))
