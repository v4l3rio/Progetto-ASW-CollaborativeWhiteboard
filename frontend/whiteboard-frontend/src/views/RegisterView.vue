<template>
    <p>Questa pagina di register non funziona, è stata utilizzata solo come esempio per il routing</p>
    <div class="d-flex justify-content-center">
    <div class="col-8">
    <form @submit.prevent="submitForm">

        <div v-if="showAlert" class="alert alert-danger" role="alert">
            {{alertMessage}}
        </div>
        <!-- Email input -->
        <div class="form-outline mb-4">
            <input type="text" id="username" class="form-control" v-model="username" required/>
            <label class="form-label" for="username">Username</label>
        </div>

        <!-- Name input -->
        <div class="form-outline mb-4">
            <input type="text" id="name" class="form-control" v-model="name" required/>
            <label class="form-label" for="email">Name</label>
        </div>

        <!-- Surname input -->
        <div class="form-outline mb-4">
            <input type="text" id="surname" class="form-control" v-model="surname" required/>
            <label class="form-label" for="surname">Surname</label>
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
        <button class="btn btn-primary btn-block mb-4" :disabled="showAlert">Register</button>

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
            surname:"",
            password:"",
            confirmPassword:"",
            showAlert: false,
            alertMessage: "",
            isFormSubmitted:false,
        }
    },
    methods: {
        checkPasswords: function () {
            if (this.password !== this.confirmPassword) {
                this.showAlert = true;
                this.alertMessage = "The passwords are different!"
            } else {
                this.showAlert = false;
            }
        },
        submitForm: function () {
            console.log("ciao")
            axios.post('http://localhost:4000/auth/register', {
                username:this.username,
                password:this.password,
                name:this.name,
                surname:this.surname
            }).then(function (response) {
                console.log(response);
                this.isFormSubmitted = true;
            })
            .catch(function (error) {
                console.log(error);
            });

        }
    },
    mounted() {
        //this.username = "cia"
        //this.name = "ciao"
        //this.surname = "ciao"
        //this.password = "ciao"
        //this.confirmPassword = "ciao"
    }
}
</script>
