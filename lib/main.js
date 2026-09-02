const SCOPE = "text.html.vue";
const { SCRIPT_LANGUAGES, STYLE_LANGUAGES } = require("./languages");

// The `attribute_value` inside a `quoted_attribute_value`, or the bare one when
// the value is unquoted.
function attributeValue(node) {
  const quoted = node.children.find((child) => child.type === "quoted_attribute_value");
  const source = quoted ?? node;
  return source.children.find((child) => child.type === "attribute_value") ?? null;
}

// `lang="…"` on a `<script>` or `<style>`. `lang` is a plain attribute — a
// `directive_attribute` holds a `directive_name`, never an `attribute_name` —
// so walking the `start_tag`'s `attribute` children is enough.
function langAttribute(node) {
  const startTag = node.children.find((child) => child.type === "start_tag");
  if (!startTag) return null;
  for (const attribute of startTag.children) {
    if (attribute.type !== "attribute") continue;
    const name = attribute.children.find((child) => child.type === "attribute_name");
    if (name?.text !== "lang") continue;
    return attributeValue(attribute)?.text ?? null;
  }
  return null;
}

// `raw_text` is optional: `<script></script>` has none, and `node.child(1)` —
// which is what the plain-HTML injections use — would hand back the `end_tag`.
function rawText(node) {
  return node.children.find((child) => child.type === "raw_text") ?? null;
}

// A block's language, from its `lang` attribute, with `fallback` when it has
// none. Returning `null` declines the injection outright, which is what should
// happen for a `lang` naming something nothing here can parse.
function blockLanguage(node, table, fallback) {
  const lang = langAttribute(node);
  if (!lang) return fallback;
  return table[lang.trim().toLowerCase()] ?? null;
}

exports.activate = function () {
  lumine.grammars.addInjectionPoint(SCOPE, {
    type: "script_element",
    language: (node) => blockLanguage(node, SCRIPT_LANGUAGES, "javascript"),
    content: rawText,
  });

  lumine.grammars.addInjectionPoint(SCOPE, {
    type: "style_element",
    language: (node) => blockLanguage(node, STYLE_LANGUAGES, "css"),
    content: rawText,
  });

  // `{{ count + 1 }}`.
  //
  // TypeScript rather than JavaScript, for the reason nvim-treesitter picks it
  // too: a template expression carries no marker saying which of the two it is,
  // and TypeScript parses every JavaScript expression plus the ones an SFC with
  // `lang="ts"` will actually contain.
  lumine.grammars.addInjectionPoint(SCOPE, {
    type: "interpolation",
    language: () => "typescript",
    content: rawText,
  });

  // `:title="label"`, `@click="onClick()"`, `v-if="visible"`, `#row="{ item }"`.
  // The value is an expression in every case.
  lumine.grammars.addInjectionPoint(SCOPE, {
    type: "directive_attribute",
    language: () => "typescript",
    content: attributeValue,
  });

  // `<template>` needs none: its children are ordinary Vue markup, which the
  // root layer already parses.
};

// True for an `attribute_value` belonging to a directive rather than to a plain
// attribute. `directive_attribute` and `attribute` are siblings in the grammar,
// so the first of the two seen walking up settles it.
function isDirectiveValue(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === "directive_attribute") return true;
    if (parent.type === "attribute") return false;
  }
  return false;
}

exports.consumeHyperlinkInjection = (hyperlink) => {
  hyperlink.addInjectionPoint(SCOPE, {
    types: ["comment", "attribute_value"],
    language(node) {
      // `href="https://…"` is a URL; `:href="route(id)"` is an expression that
      // merely looks like one often enough to matter.
      if (isDirectiveValue(node)) return null;
    },
  });
};

exports.consumeTodoInjection = (todo) => {
  todo.addInjectionPoint(SCOPE, { types: ["comment"] });
};
