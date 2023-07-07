<template>
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        {{text}}
        <button type="button" class="btn-close bi-align-end" @click="closeClick"></button>
    </div>
</template>

<script>
export default {
    name: "Alert",
    props: {
        text: String,
        closeClick: Function
    }
}
</script>

<style scoped>

</style>