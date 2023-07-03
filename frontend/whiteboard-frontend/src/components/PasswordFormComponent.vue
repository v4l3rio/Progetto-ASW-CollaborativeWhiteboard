<template>
    <div class="input-group mb-3">
            <div class="form-floating">
                <input :type="isVisible ? 'text' : 'password'" class="form-control" id="floatingPassword" placeholder="Password" aria-required="true" required>
                <label for="floatingPassword">Password</label>
            </div>
            <button class="btn btn-outline-secondary" type="button" id="button-addon1" @click="showPassword">
                <img :src="require('../assets/icons/' + image)" alt="show password"/>
            </button>
        </div>
</template>
<script>
export default {
    name: "PasswordFormComponent",
    data(){
        return{
            image: 'eye-slash.svg',
            iconHide: 'eye-slash.svg',
            iconShow: 'eye.svg', 
            isVisible: false,
        }
    },   
    methods: {
        init() {
            if (this.isVisible) {
                this.image = this.iconShow;
            } else {
                this.image = this.iconHide;
            }
        },
        showPassword() {
            this.isVisible = this.isVisible ? false : true;
            this.init();
        }
    }
}
</script>