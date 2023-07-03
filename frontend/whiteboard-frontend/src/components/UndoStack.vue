<template>
    <button v-on:click="undoLine()" class="btn undoBtn"><img src="../assets/undo.svg" alt="Undo"></button>
</template>

<script>
export default {
    name: "UndoStack",
    data() {
        return {
            idStack : []
        }
    },
    methods: {
        undoLine: function () {
            try {
                const id = this.idStack.pop();
                document.getElementById(id).remove(); // todo also removes on all clients and server, so it must broadcast this change
            } catch (ignored) {}
        },
        addLine(id) {
            this.idStack.push(id)
        }
    }
}
</script>

<style scoped>

</style>