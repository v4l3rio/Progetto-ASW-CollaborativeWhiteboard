

<template>
  <i :class="`${this.icon} icon`" :style="`font-size: ${size}; color: ${color};`"></i>
</template>
<script>
import 'bootstrap-icons/font/bootstrap-icons.css'
export default {
  name: "BootstrapIcon",
  props: {
    icon: String,
    size: {
      default: "1rem",
      type: String
    },
    color: {
      default: "black",
      type: String
    }
  }
}
</script>
<style scoped>
  .icon:hover {
    filter: brightness(50%);
    transition: 0.3s;
  }
</style>