// Values are exact injection aliases, not scopes. Each must appear in exactly
// one Tree-sitter grammar's `injectionNames` array.
//
// JSX has no grammar of its own here, but tree-sitter-javascript parses JSX, so
// it resolves to JavaScript rather than being dropped.
const SCRIPT_LANGUAGES = Object.freeze({
  js: "javascript",
  javascript: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "javascript",
  babel: "javascript",
  ts: "typescript",
  typescript: "typescript",
  tsx: "tsx",
});

// PostCSS has no dedicated parser, but CSS is a useful structural fallback.
// Less and indented Sass resolve to their own Tree-sitter grammars. Stylus is
// deliberately absent rather than being parsed with incompatible structure.
const STYLE_LANGUAGES = Object.freeze({
  css: "css",
  postcss: "css",
  scss: "scss",
  less: "less",
  sass: "sass",
});

module.exports = { SCRIPT_LANGUAGES, STYLE_LANGUAGES };
