<template>
  <button :class="className" v-on="this.$attrs">{{text}}</button>
</template>

<script>
export default {
  name: "CycleButton",
  props: {
    text: {
      type: String,
      required: true,
      default: ""
    },
    modifiers: {
      type: String,
      required: true,
      default: ""
    }
  },
  computed: {
    className() {
      return this.modifiers? "btn btn--" + this.modifiers :"btn btn--default";
    }
  }
};
</script>

<style <style lang="scss">
.btn {
  border-radius: 25%;  
  &--default {
    background: yellow;
  }

}
</style>

