<template>
    <h5>Utenti connessi</h5>
    <div v-for="user in connectedUsers">
       <p>{{user}}</p>
    </div>
</template>

<script>
export default {
    name: "ActiveUserInWhiteboard",
    data() {
        return {
            connectedUsers: ["Thomas", "Valerio", "Francesco"]
        };
    },
}
</script>

<style scoped>

</style>