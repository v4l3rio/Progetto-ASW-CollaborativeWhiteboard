<template>

    <svg width="100%"
         height="100%"
         id="whiteboard"
    >
        <g v-html="paths"></g>
        <rect id="bg" width="100%" height="100%" fill="#FFFFFF"></rect>
    </svg>
</template>

<script>
import Interpolation from "@/components/Interpolation.vue";
import {traitToPaths} from "@/scripts/whiteboard/pointsToSvg";
const $ = document.querySelector.bind(document)
export default {
    name: "StaticWhiteboard",
    data() {
        return {
            svg: "",
            paths: ``
        }
    },
    methods: {
        traitToPaths,
        renderPaths() {
            for (const [id, trait] in Object.entries(this.traits)) {
                console.log(trait);
                this.paths += traitToPaths(trait, this.svg, id)
            }
        }
    },
    props: {
        traits: Object
    },
    mounted() {
        console.log(this.traits);
        this.svg = $("#whiteboard")
        //this.renderPaths()
    }
}
</script>

<style scoped>

</style>