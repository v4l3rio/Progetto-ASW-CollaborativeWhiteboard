<template>
<div class="container text-start">
    <div class="row row-cols-1 row-cols-sm-5 g-3">
        <AddWhiteboardComponent v-bind:addProps="addProps"></AddWhiteboardComponent>
    </div>
    <h1 class="h3 mb-3">Your files</h1>
    <div class="row row-cols-1 row-cols-md-4 g-4">
        <CardPlaceholderComponent v-if="!isReady"></CardPlaceholderComponent>
        <CardComponent v-else></CardComponent>
    </div>
    <FooterComponent></FooterComponent>
</div>
</template>
<script>
import CardPlaceholderComponent from "@/components/CardPlaceholderComponent.vue"
import CardComponent from "@/components/CardComponent.vue"
import AddWhiteboardComponent from "@/components/AddWhiteboardComponent.vue"
export default {
    name: 'AddWhiteboardView',
    data() {
        return {
            isReady: true,
            addProps: [
                { title: 'Add new whiteboard', icon: "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z", color: 'btn-outline-primary', alt: 'add whiteboard plus icon'},
                { title: 'Import whiteboard', icon: "M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z", color: 'btn-outline-secondary', alt: 'import whiteboard arrow up icon'},
            ]
        }
    },
    components: {
        CardComponent,
        CardPlaceholderComponent,
        AddWhiteboardComponent
    },
    methods: {
    },
    mounted: function () {
    }
}
</script>
