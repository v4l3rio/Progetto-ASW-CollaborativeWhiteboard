<template>
    <div class="col" v-for="(whiteboard, index) in whiteboards" :key="index" >
        <div class="card border-secondary text-start h-100">
            <img v-bind:src="require('../assets/icons/' + whiteboard.image)" width="150" height="150" class="card-img-top" alt="whiteboard preview" @error="replaceByDefault">
                <div class="card-body justify-content-center align-items-center">
                    <h6 class="card-title d-inline text-start"><strong>{{whiteboard.title}}</strong></h6>
                    <div class="dropdown text-end d-inline-flex align-items-center mx-auto">
                        <button class="btn btn-outline-light" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="z-index: 2;">
                            <img src="../assets/icons/three-dots-vertical.svg" width="20" height="20"/>
                        </button>
                        <ul class="dropdown-menu text-small" data-popper-placement="bottom-end" style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(0px, 34.4px, 0px);">
                            <li><a class="dropdown-item" role="button">Open</a></li>
                            <li><a class="dropdown-item" role="button" @click="deleteWhiteboard(index)">Rename</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item link-danger" role="button" @click="deleteWhiteboard(index)">Delete</a></li>
                        </ul>
                    </div>
                </div>
                <a href="#" class="stretched-link"></a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CardComponent',
    props: ['whiteboards'],
    emits:['card-deleted', 'card-renamed'],
    methods: {
        replaceByDefault(event) {
            event.target.src = "https://www.stillisolutions.com/wp-content/uploads/2017/09/no-image-box-300x155.png"
        },
        deleteWhiteboard(index) {
            this.$emit('card-deleted', index);
        },
        renameCard(index) {
            this.$emit('card-renamed', index);
        }
    }
}
</script>