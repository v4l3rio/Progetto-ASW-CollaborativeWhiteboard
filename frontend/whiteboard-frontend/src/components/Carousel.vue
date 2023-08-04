

<template>
  <div id="carouselExampleSlidesOnly" class="carousel slide pb-4" data-ride="carousel" data-bs-interval="1000">
    <div class="carousel-inner p-4">
      <slot></slot>
    </div>
  </div>
</template>
<script>

import * as bootstrap from 'bootstrap';
export default {
  name: "Carousel",

}
</script>
<style scoped>
</style>