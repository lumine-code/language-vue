# language-vue

Vue language support.

## Features

- **Grammars**: provides Tree-sitter grammars, built from [tree-sitter-vue](https://github.com/tree-sitter-grammars/tree-sitter-vue).
- **Syntax highlighting**: full tree-sitter grammar coverage for single-file components.
- **Directives**: scopes `v-` directives, the `:`, `@`, `#` and `.` shorthands, dynamic arguments and modifiers.
- **Embedded languages**: highlights each block in the language its `lang` attribute names — JavaScript, TypeScript, TSX, CSS or SCSS.
- **Expressions**: highlights interpolations and directive values as code rather than as strings.
- **Folding**: folds blocks from the parse tree rather than by indentation.

## Installation

To install `language-vue` search for _language-vue_ in the Install pane of the Lumine settings or run `lumine --install lumine-code/language-vue`.

## Usage

`<script>` and `<style>` blocks are highlighted according to their `lang` attribute, defaulting to JavaScript and CSS. `less` and `postcss` are read with the SCSS grammar, which is close enough to be useful; indented `sass`, `stylus` and `pug` have no Tree-sitter grammar in the ecosystem and are left unhighlighted rather than highlighted wrongly.

Interpolations and directive values are highlighted as TypeScript, which parses both plain JavaScript expressions and the ones a component written with `lang="ts"` will contain.

## Services

- **hyperlink.injection** (`^1.0.0`): consumed to highlight URLs inside comments and plain attribute values as clickable links. Directive values are excluded — they are expressions, not URLs.
- **todo.injection** (`^1.0.0`): consumed to highlight `TODO`-style markers inside comments.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
