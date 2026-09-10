const fs = require("fs");
const path = require("path");
const { Point } = require("lumine");

const HTML_HIGHLIGHTS_PATH = path.join(__dirname, "..", "grammars", "vue-html-highlights.scm");
const VUE_HIGHLIGHTS_PATH = path.join(__dirname, "..", "grammars", "vue-highlights.scm");

// Asserts the scopes the grammar actually produces, using the fixture beside
// this file. `runGrammarTests` reads `<- scope` and `^ scope` assertions out of
// the fixture's own comments, so the fixture is the readable spec.
//
// A fixture whose assertions never run still reports green, so break one
// expected scope and confirm this fails before trusting it.
//
// Nothing inside `<script>` or `<style>` can be asserted here: their bodies are
// `raw_text`, so a `<!-- -->` written there is not scoped as a comment and the
// assertion is silently skipped. `injections-spec.js` covers those blocks.

describe("Vue Tree-sitter grammar", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-vue");
    // The fixture asserts `source.ts` inside an interpolation and a directive
    // value. Without this the injection resolves to nothing, the assertion
    // fails, and the reason is not obvious from the message.
    await lumine.packages.activatePackage("language-typescript");
  });

  it("tokenizes the fixture", async () => {
    await runGrammarTests(path.join(__dirname, "fixtures", "sample.vue"), /<!--/, /-->/);
  });

  it("preserves HTML tag classes and empty attribute delimiters", async () => {
    const editor = await lumine.workspace.open("tag-scopes.vue");
    const text = [
      "<template>",
      "<html><div><span><custom first=\"\" second='' /></span></div></html>",
      "</template>",
    ].join("\r\n");
    editor.setText(text);
    await editor.languageMode.ready;

    const scopesAt = (needle, offset = 0, occurrence = 0) => {
      let index = -1;
      for (let count = 0; count <= occurrence; count++) index = text.indexOf(needle, index + 1);
      return editor
        .scopeDescriptorForBufferPosition(
          editor.getBuffer().positionForCharacterIndex(index + offset),
        )
        .getScopesArray();
    };

    for (const occurrence of [0, 1]) {
      expect(scopesAt("html", 0, occurrence)).toContain("entity.name.tag.structure.html.html");
      expect(scopesAt("div", 0, occurrence)).toContain("entity.name.tag.block.div.html");
      expect(scopesAt("span", 0, occurrence)).toContain("entity.name.tag.inline.span.html");
    }
    expect(scopesAt("custom")).toContain("entity.name.tag.html");
    expect(scopesAt("<custom")).toContain("punctuation.definition.tag.begin.html");
    expect(scopesAt("/>", 1)).toContain("punctuation.definition.tag.end.html");

    for (const [quote, opening, closing] of [
      ['"', 0, 1],
      ["'", 0, 1],
    ]) {
      expect(scopesAt(quote, 0, opening)).toContain("punctuation.definition.string.begin.html");
      expect(scopesAt(quote, 0, opening)).not.toContain("punctuation.definition.string.end.html");
      expect(scopesAt(quote, 0, closing)).toContain("punctuation.definition.string.end.html");
      expect(scopesAt(quote, 0, closing)).not.toContain("punctuation.definition.string.begin.html");
    }
  });

  it("keeps a six-row tile local inside a 6000-attribute HTML tag", async () => {
    const editor = await lumine.workspace.open("large-start-tag.vue");
    const lines = [
      "<template>",
      "<root",
      ...Array.from({ length: 6000 }, (_, index) => `  key_${index}="value_${index}"`),
      ">body</root>",
      "</template>",
    ];
    editor.setText(lines.join("\r\n"));
    const languageMode = editor.getBuffer().languageMode;
    await languageMode.ready;
    expect(languageMode.tree.rootNode.hasError).toBe(false);

    const startRow = 2999;
    const endRow = startRow + 6;
    const layer = languageMode.rootLanguageLayer;
    const captures = layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(startRow, 0),
      endPosition: new Point(endRow, 0),
    });

    expect(captures.length).toBeLessThanOrEqual(60);
    expect(
      captures.every(
        ({ node }) => node.startPosition.row >= startRow && node.startPosition.row < endRow,
      ),
    ).toBe(true);
  });

  it("keeps unbounded HTML tag contexts leaf-rooted", () => {
    const query = fs.readFileSync(HTML_HIGHLIGHTS_PATH, "utf8");
    expect(query).not.toMatch(/^\((?:start_tag|end_tag|self_closing_tag)\b/m);
    expect(query).toContain('(#is? test.childOfType "start_tag end_tag")');
    expect(query).toContain('(#is? test.childOfType "start_tag end_tag self_closing_tag")');
  });

  it("keeps the top-level template tag scope local inside a 6000-child SFC", async () => {
    const query = fs.readFileSync(VUE_HIGHLIGHTS_PATH, "utf8");
    expect(query).not.toMatch(/\(template_element\s+\((?:start_tag|end_tag)/);
    expect(query).toContain('(#is? test.typeAt "parent.parent template_element")');

    const editor = await lumine.workspace.open("large-template.vue");
    const lines = [
      "<template>",
      ...Array.from({ length: 6000 }, (_, index) => `  <div>${index}</div>`),
      "</template>",
    ];
    editor.setText(lines.join("\r\n"));
    const languageMode = editor.getBuffer().languageMode;
    await languageMode.ready;
    expect(languageMode.tree.rootNode.hasError).toBe(false);
    expect(editor.scopeDescriptorForBufferPosition([0, 1]).getScopesArray()).toContain(
      "entity.name.tag.structure.template.vue",
    );
    expect(editor.scopeDescriptorForBufferPosition([6001, 2]).getScopesArray()).toContain(
      "entity.name.tag.structure.template.vue",
    );

    const startRow = 2998;
    const endRow = startRow + 6;
    const layer = languageMode.rootLanguageLayer;
    const captures = layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(startRow, 0),
      endPosition: new Point(endRow, 0),
    });
    expect(captures.length).toBeLessThanOrEqual(72);
    expect(
      captures.every(
        ({ node }) => node.startPosition.row >= startRow && node.startPosition.row < endRow,
      ),
    ).toBe(true);
  });
});
