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

            <!-- Email input -->
            <div class="form-outline mb-4">
                <input type="text" id="username" class="form-control" v-model="username" required/>
                <label class="form-label" for="username">Username</label>
            </div>

            <!-- Name input -->
            <div class="form-outline mb-4">
                <input type="text" id="name" class="form-control" v-model="name" required/>
                <label class="form-label" for="name">Name</label>
            </div>

            <!-- Surname input -->
            <div class="form-outline mb-4">
                <input type="text" id="lastName" class="form-control" v-model="lastName" required/>
                <label class="form-label" for="lastName">Surname</label>
            </div>

            <!-- Password input -->
            <div class="form-outline mb-4">
                <input type="password" id="password" class="form-control" @input="this.checkPasswords"
                       v-model="password" required/>
                <label class="form-label" for="password">Password</label>
            </div>

            <!-- Confirm input -->
            <div class="form-outline mb-4">
                <input type="password" id="confirmPassword" class="form-control" @input="this.checkPasswords"
                       v-model="confirmPassword" required />
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

        }
    }
}
</script>
