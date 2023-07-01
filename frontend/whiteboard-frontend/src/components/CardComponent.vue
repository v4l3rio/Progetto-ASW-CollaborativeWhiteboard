<template>
    <div class="col" v-for="(whiteboard, index) in whiteboards" :key="index" >
        <div class="card border-secondary text-start h-100">
            <img v-bind:src="require('../assets/icons/' + whiteboard.image)" width="150" height="150" class="card-img-top" alt="whiteboard preview" @error="replaceByDefault">
                <div class="card-body">
                    <h6 class="card-title"><strong>{{whiteboard.title}}</strong></h6>
                </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CardComponent',
    props: ['whiteboards'],
    methods: {
        replaceByDefault(event) {
            event.target.src = "https://www.stillisolutions.com/wp-content/uploads/2017/09/no-image-box-300x155.png"
        }
    }
}
</script>