const path = require("path");

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
    lumine.config.set("language.useTreeSitterParsers", true);
    await lumine.packages.activatePackage("language-vue");
    // The fixture asserts `source.ts` inside an interpolation and a directive
    // value. Without this the injection resolves to nothing, the assertion
    // fails, and the reason is not obvious from the message.
    await lumine.packages.activatePackage("language-typescript");
  });

  it("tokenizes the fixture", async () => {
    await runGrammarTests(path.join(__dirname, "fixtures", "sample.vue"), /<!--/, /-->/);
  });
});
