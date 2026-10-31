; Existing literal and comment contents are user data, including whitespace.
([(text) (comment) (quoted_attribute_value)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))

; A whole multiline start tag would indent every attribute again. Only the
; first line opens the attribute continuation; the final > starts its body.
((start_tag) @indent
  (#is? test.endsOnSameRowAs startPosition)
  (#not-match? @indent "^<(?:area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)(?=\\s|>)"))

(start_tag "<" @indent
  (#is-not? test.startsOnSameRowAs parent.endPosition))

(start_tag ">" @match
  (#is-not? test.startsOnSameRowAs parent.startPosition)
  (#set! indent.match parent.startPosition))

((start_tag ">" @match.next) @_tag
  (#is-not? test.startsOnSameRowAs parent.startPosition)
  (#is? test.lastTextOnRow true)
  (#not-match? @_tag "^<(?:area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)(?=\\s|>)")
  (#set! indent.match parent.startPosition)
  (#set! indent.offset 1))

((start_tag ">" @match.next) @_tag
  (#is-not? test.startsOnSameRowAs parent.startPosition)
  (#is? test.lastTextOnRow true)
  (#match? @_tag "^<(?:area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)(?=\\s|>)")
  (#set! indent.match parent.startPosition))

(self_closing_tag "<" @indent
  (#is-not? test.startsOnSameRowAs parent.endPosition))

(self_closing_tag "/>" @match @match.next
  (#is-not? test.startsOnSameRowAs parent.startPosition)
  (#is? test.lastTextOnRow true)
  (#set! indent.match parent.startPosition))

; Wait for the complete closing tag before moving a line while typing.
((end_tag) @dedent
  (#match? @dedent ">$"))
