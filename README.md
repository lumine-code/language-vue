# language-vue

Vue language support.

## Features

- **Grammars**: provides Tree-sitter grammars, built from [tree-sitter-vue](https://github.com/tree-sitter-grammars/tree-sitter-vue).
- **Syntax highlighting**: full tree-sitter grammar coverage for single-file components.
- **Directives**: scopes `v-` directives, the `:`, `@`, `#` and `.` shorthands, dynamic arguments and modifiers.
- **Embedded languages**: highlights each block in the language its `lang` attribute names — JavaScript, TypeScript, TSX, CSS, SCSS, Less or Sass.
- **Expressions**: highlights interpolations and directive values as code rather than as strings.
- **Folding**: folds blocks from the parse tree rather than by indentation.

## Installation

To install `language-vue` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-vue`.

## Usage

`<script>` and `<style>` blocks are highlighted according to their `lang` attribute, defaulting to JavaScript and CSS. Less, SCSS and indented Sass use their dedicated parsers; PostCSS uses CSS as a structural fallback. Stylus and Pug remain unhighlighted because no corresponding grammar is registered.

Interpolations and directive values are highlighted as TypeScript, which parses both plain JavaScript expressions and the ones a component written with `lang="ts"` will contain.

## Services

- `hyperlink.injection`: consumed to highlight URLs inside comments and plain attribute values as clickable links. Directive values are excluded — they are expressions, not URLs.
- `todo.injection`: consumed to highlight `TODO`-style markers inside comments.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
