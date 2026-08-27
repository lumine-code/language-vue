const path = require("path");

// The half of the grammar `tree-sitter-grammar-spec.js` cannot reach.
//
// `runGrammarTests` reads its assertions out of the fixture's own comments, and
// a comment is only recognised where the grammar scopes one — so nothing inside
// a `<script>` or `<style>` body, which is `raw_text`, can be asserted there.
// Those blocks are the whole point of an SFC, so they are asserted here instead,
// by position.

const FIXTURE = path.join(__dirname, "fixtures", "sample.vue");

// The first column of the first line whose text contains `needle`.
function positionOf(editor, needle, offset = 0) {
  const lines = editor.getBuffer().getLines();
  for (let row = 0; row < lines.length; row++) {
    const column = lines[row].indexOf(needle);
    if (column !== -1) return { row, column: column + offset };
  }
  throw new Error(`Fixture has no line containing ${JSON.stringify(needle)}`);
}

function scopesAt(editor, position) {
  return editor.scopeDescriptorForBufferPosition(position).getScopesArray();
}

describe("Vue injections", () => {
  let editor;

  beforeEach(async () => {
    lumine.config.set("editor.useTreeSitterParsers", true);
    await lumine.packages.activatePackage("language-vue");
    // Every grammar the fixture's `lang` attributes and expressions resolve to.
    await lumine.packages.activatePackage("language-javascript");
    await lumine.packages.activatePackage("language-typescript");
    await lumine.packages.activatePackage("language-css");
    await lumine.packages.activatePackage("language-sass");

    editor = await lumine.workspace.open(FIXTURE);
    await editor.languageMode.ready;
  });

  it("parses the fixture without error", () => {
    expect(editor.getBuffer().getLanguageMode().tree.rootNode.hasError).toBe(false);
  });

  it('injects TypeScript into `<script lang="ts">`', () => {
    // `export` on the first line of the block body.
    const position = positionOf(editor, "export default", 2);
    expect(scopesAt(editor, position)).toContain("source.ts");
  });

  it('injects SCSS into `<style lang="scss">`', () => {
    const position = positionOf(editor, "  color: red;", 4);
    expect(scopesAt(editor, position)).toContain("source.css.scss");
  });

  it("injects TypeScript into an interpolation", () => {
    const position = positionOf(editor, "{{ label }}", 4);
    expect(scopesAt(editor, position)).toContain("source.ts");
  });

  it("injects TypeScript into a directive value", () => {
    const position = positionOf(editor, ':title="x"', 8);
    expect(scopesAt(editor, position)).toContain("source.ts");
  });

  it("leaves a plain attribute value alone", () => {
    // The counterpart to the rule above: `class="a"` is a literal, not an
    // expression, and must not pick up a source scope.
    const position = positionOf(editor, 'class="a"', 7);
    expect(scopesAt(editor, position)).not.toContain("source.ts");
  });

  describe("language resolution", () => {
    // `language()` returns a language string; the registry matches it against
    // every grammar's `injectionRegex`, longest match wins. These assert the
    // mapping table in `lib/main.js` reaches a real grammar, which is the part
    // that silently degrades to no highlighting at all when it does not.
    const CASES = [
      ["javascript", "source.js"],
      ["typescript", "source.ts"],
      ["tsx", "source.tsx"],
      ["css", "source.css"],
      ["scss", "source.css.scss"],
    ];

    for (const [languageString, scopeName] of CASES) {
      it(`resolves ${languageString} to ${scopeName}`, () => {
        const grammar = lumine.grammars.treeSitterGrammarForLanguageString(languageString);
        expect(grammar?.scopeName).toBe(scopeName);
      });
    }
  });
});
