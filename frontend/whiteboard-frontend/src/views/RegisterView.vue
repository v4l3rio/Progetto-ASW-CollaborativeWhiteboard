<template>
    <div class="d-flex justify-content-center">
    <div class="col-8">
        <div v-if="showAlert" class="alert alert-danger" role="alert">
            {{alertMessage}}
        </div>
        <div v-if="isFormSubmitted" class="alert alert-success" role="alert">
            <p>Registered successfully</p>
            <a href="#/login">Go to Login</a>
        </div>
        <form @submit.prevent="submitForm" v-if="!isFormSubmitted">

            <EmailFormComponent @email-changed="emailHandler"></EmailFormComponent>

            <!-- Name input -->
            <div class="form-floating  mb-4">
                <input type="text" id="name" class="form-control" aria-required="true" v-model="name" placeholder="Name" required/>
                <label class="form-label" for="name">Name</label>
            </div>

            <!-- Surname input -->
            <div class="form-floating  mb-4">
                <input type="text" id="lastName" class="form-control" aria-required="true" v-model="lastName" placeholder="Surname" required/>
                <label class="form-label" for="lastName">Surname</label>
            </div>

            <PasswordFormComponent @password-changed="passwordHandler" @input="this.checkPasswords"></PasswordFormComponent>

            <!-- Confirm input -->
            <div class="form-floating  mb-4">
                <input type="password" id="confirmPassword" class="form-control" @input="this.checkPasswords" aria-required="true"
                       v-model="confirmPassword" placeholder="Confirm Password" required />
                <label class="form-label" for="confirmPassword">Confirm Password</label>
            </div>

            <!-- Submit button -->
            <button class="btn btn-primary btn-block mb-4" :disabled="passwordCheckError" >Register</button>

            <!-- Login buttons -->
            <div class="text-center">
                <p>Already a member? <a href="#/login">Login</a></p>
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
    name: 'RegisterView',
    data() {
        return {
            username:"",
            name:"",
            lastName:"",
            password:"",
            confirmPassword:"",
            showAlert: false,
            passwordCheckError:false,
            alertMessage: "",
            isFormSubmitted:false,
        }
    },
    components: {
        EmailFormComponent,
        PasswordFormComponent
    },
    methods: {
        checkPasswords: function () {
            if (this.password !== this.confirmPassword) {
                this.showAlert = true;
                this.passwordCheckError = true;
                this.alertMessage = "The passwords are different!"
            } else {
                this.showAlert = false;
                this.passwordCheckError = false;
            }
        },
        submitForm: function () {
            const ref = this;
            axios.post('http://localhost:4000/auth/register', {
                username:this.username,
                password:this.password,
                first_name:this.name,
                last_name:this.lastName
            }).then(function (response) {
                ref.isFormSubmitted = true;
                ref.showAlert = false;
            }).catch(function (error) {
                ref.showAlert = true;
                ref.alertMessage = error.response.data.message ? error.response.data.message : "There was an error";
            });

        },
        passwordHandler(password) {
            this.password = password;
        },
        emailHandler(email) {
            this.email = email;
        },
    }
}
</script>
