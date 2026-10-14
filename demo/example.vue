<template>
  <div class="a">
    <p :title="x" @go.once="f" v-if="y">
      {{ label }}
    </p>
    <MyWidget :[key]="v" />
    <a href="https://example.com">link</a>
    <!-- A plain HTML comment. -->
  </div>
</template>

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
