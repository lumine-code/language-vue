<template>
<!-- ^ entity.name.tag.structure -->
  <div class="a">
<!--^ entity.name.tag.block -->
<!--     ^ entity.other.attribute-name.html -->
    <p :title="x" @go.once="f" v-if="y">
<!--   ^ punctuation.definition.directive -->
<!--     ^ entity.other.attribute-name.binding -->
<!--           ^ source.ts -->
<!--              ^ punctuation.definition.directive -->
<!--                ^ entity.other.attribute-name.event -->
<!--                  ^ entity.other.attribute-name.modifier -->
<!--                           ^ entity.other.attribute-name.directive -->
      {{ label }}
<!--  ^ punctuation.section.embedded -->
<!--     ^ source.ts -->
    </p>
    <MyWidget :[key]="v" />
<!--   ^ entity.name.tag.component -->
<!--          ^ punctuation.definition.directive -->
<!--             ^ variable.other.dynamic-argument -->
    <a href="https://example.com">link</a>
<!-- ^ entity.name.tag.inline -->
<!--    ^ entity.other.attribute-name.html -->
    <!-- A plain HTML comment. -->
  </div>
</template>

<!-- Nothing below this line can be asserted with a caret: a comment opened -->
<!-- inside `<script>` or `<style>` is raw text, not a comment, so an       -->
<!-- assertion written there is silently skipped. `spec/injections-spec.js` -->
<!-- covers those blocks instead.                                          -->

<script lang="ts">
export default {
  name: "Card",
  props: { label: { type: String, required: true } },
};
</script>

<style lang="scss">
.a {
  color: red;
  .nested {
    color: blue;
  }
}
</style>
