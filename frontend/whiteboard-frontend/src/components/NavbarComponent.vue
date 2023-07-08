<template>
    <nav class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div class="col-md-3 mb-2 mb-md-0">
            <a href="/" class="d-inline-flex link-body-emphasis text-decoration-none">
            <img src="../assets/icons/Logo.png" width="135" height="38">
            </a>
        </div>
        <ul class="nav nav-pills col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            <li class="nav-item"><a href="#/" class="nav-link px-2">Home</a></li>
            <li class="nav-item" v-if="isLogged"><a href="#/addwhiteboard" class="nav-link px-2">Whiteboards</a></li>
            <li class="nav-item" v-if="isLogged"><a href="#/profile" class="nav-link px-2">Settings</a></li>
            <li class="nav-item"><a href="#/" class="nav-link px-2">Contacts</a></li>
        </ul>
        <div class="col-md-3">
            <div v-if="!isLogged">
                <a role="button" class="btn btn-light mx-2"  href="#/login">Sign In</a>
                <a role="button" class="btn btn-outline-success" href="#/register">Sign Up</a>
            </div>
            <div v-else class="dropdown ">
                <a role="button" class="btn btn-light link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="true">
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