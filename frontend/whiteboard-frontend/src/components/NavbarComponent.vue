<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom mb-5">
        <div class="container justify-content-center align-items-center">
            <a class="navbar-brand " href="#/">
                <img src="../assets/icons/Logo.png" width="135" height="38">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="#/">Home</a>
                    </li>
                    <li v-if="isLogged" class="nav-item">
                        <a class="nav-link" aria-current="page" href="#/addWhiteboard">Whiteboards</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Contacts</a>
                    </li>
                </ul>
            </div>
            <div v-if="!isLogged" class="text-end">
                <a role="button" class="btn btn-light mx-2"  href="#/login">Sign In</a>
                <a role="button" class="btn btn-outline-success" href="#/register">Sign Up</a>
            </div>
            <div v-else class="dropdown text-end">
                <a role="button" class="btn btn-light d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="true">
                    <img src="../assets/icons/person-circle.svg" alt="mdo" width="32" height="32" class="rounded-circle">
                </a>
                <ul class="dropdown-menu text-small" data-popper-placement="bottom-end" style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(0px, 34.4px, 0px);">
                    <li><a class="dropdown-item" href="#/addWhiteboard">New project</a></li>
                    <li><a class="dropdown-item" href="#/profile">Profile</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item  link-danger" role="button" @click="logout">Sign out</a></li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
import axios from "axios";
export default {
    name: 'NavbarComponent',
    props: ['loginStatus'],
    data() {
        return {
            isLogged: false
        }
    },
    methods: {
        isUserLogged() {
            axios.post('http://localhost:4000/auth/refresh', {
                accessToken: localStorage.getItem('accessToken'),
                refreshToken: localStorage.getItem('refreshToken')
            }).then(response => {
                this.isLogged = true;
                this.$forceUpdate();
            }).catch(error => {
                this.isLogged = false;
                this.$forceUpdate();
            });
        },
        logout() {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            this.isLogged = false
            this.$router.replace({ path: '/' })
        }
    },
    updated: function() {
        this.isUserLogged();
    },
    mounted: function() {
        this.isUserLogged();
    }
}
</script>