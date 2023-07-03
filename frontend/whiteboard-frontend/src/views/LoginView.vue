<template>
    <div class="d-flex justify-content-center">
    <div class="col-4 ">
    <form @submit.prevent="submitForm">
        <h1 class="h3 mb-2">Login</h1>
        <EmailFormComponent @email-changed="emailHandler"></EmailFormComponent>
        <PasswordFormComponent @password-changed="passwordHandler"></PasswordFormComponent>
        <div class="alert alert-danger" role="alert" :hidden="!this.isInvalid">
                Wrong Email or password.
        </div>
        <div class="form-floating mb-3">
            <button type="submit" class="btn btn-primary col-12" id="SignInButton">Sign in</button>
        </div>
        <div class="text-center">
            <p>Not a member? <a href="#/register">Register</a></p>
        </div>
    </form>
    </div>
    </div>
</template>
<script>
import axios from "axios";
import EmailFormComponent from "@/components/EmailFormComponent.vue"
import PasswordFormComponent from "@/components/PasswordFormComponent.vue";
export default {
    name: 'LoginView',
    components: {
        EmailFormComponent,
        PasswordFormComponent
    },
    data() {
        return {
            email: '',
            password: '',
            isInvalid: false
        }
    },
    methods: {
        emailHandler(email) {
            this.email = email;
        },
        passwordHandler(password) {
            this.password = password;
        },
        submitForm() {
            const ref = this;
            axios.post('http://localhost:4000/auth/login', {
                username: this.email,
                password: this.password,
            }).then(response => {
                this.$router.replace({ path: '/addwhiteboard' })
            }).catch(error => {
                this.isInvalid = true;
            });
        }
    },
    mounted: function () {
    }
}
</script>