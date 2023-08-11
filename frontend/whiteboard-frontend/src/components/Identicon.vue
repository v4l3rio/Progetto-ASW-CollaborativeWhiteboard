<template>
    <svg width="100%" height="100%" viewBox="0 0 100 100"
         xmlns="http://www.w3.org/2000/svg" class="rounded-circle border">
        <image height="100%" width="100%" :href="`data:image/svg+xml;base64,${base64}`" clip-path="inset(0% round 50px)"></image>
    </svg>
</template>

<script>
import {sha256} from "@/scripts/hashing/hashing";
import Identicon from "identicon.js"
export default {
    name: "Identicon",
    props: {
      seed: String,
      takeFromStorage: {
        type: Boolean,
        default: false
      }
    },
    data() {
        return {
            base64: ""
        }
    },
    methods: {
        update() {
          const computed = localStorage.getItem("base64");
            if (computed === null || !this.takeFromStorage) {
                sha256(this.seed).then(res => {
                    this.base64 = new Identicon(res, {
                        background: [255, 255, 255, 0],
                        format: 'svg'
                    }).toString();
                    if (this.takeFromStorage) {
                      localStorage.setItem("base64", this.base64);
                    }
                 });
            } else {
                this.base64 = computed;
            }
        }
    },
    mounted() {
        this.update();
    }
}
</script>

<style scoped>

</style>