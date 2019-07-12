<template>
    <input 
    type="radio" 
    v-bind="$attrs"
    v-on="$listeners"

    >
</template>

<script>
export default {
name:"CycleRadioInput",
props:{
    attrs:this.$attrs,
    listeners:this.$listeners
}
}
</script>

<style>

</style>
