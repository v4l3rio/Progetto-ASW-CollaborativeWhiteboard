<template>
  <div id="carouselExampleSlidesOnly" class="carousel slide pb-4" data-bs-ride="carousel" data-bs-interval="2000">
    <div class="carousel-inner p-4">
      <slot></slot>
    </div>
  </div>
</template>
<script>

export default {
    name: "Carousel",
}
</script>
<style scoped>
</style>