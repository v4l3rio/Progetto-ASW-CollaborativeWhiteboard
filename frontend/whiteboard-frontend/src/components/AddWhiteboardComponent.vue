<template>
  <div class="col-3 mb-3" v-for="(item, index) in addProps" :key="index">
    <button @click="addWhiteboard(index)" type="button" :class="item.color" class="btn d-inline-flex align-items-center col-12 p-2 h-100" id="SignInButton" >
      <div class="flex-fill">{{item.title}}</div>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi" viewBox="0 0 16 16">
        <path :d="item.icon"></path>
      </svg>
    </button>
  </div>
</template>
<script>
export default {
  name: 'AddWhiteboardComponent',
  props: ['addProps'],
  emits: ['add-whiteboard'],
  methods: {
    addWhiteboard(index) {
      this.$emit('add-whiteboard', index);
    }
  }
}
</script>