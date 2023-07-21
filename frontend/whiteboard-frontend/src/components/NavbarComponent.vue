<template>
    <nav class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <router-link to="/" class="col-md-3 mb-2 mb-md-0">
            <img src="../assets/icons/Logo.png" width="135" height="38">
        </router-link>
        <ul class="nav nav-pills col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            <router-link to="/" class="nav-item nav-link px-2">Home</router-link>
            <router-link to="/addwhiteboard" v-if="isLogged" class="nav-item nav-link px-2">Whiteboards</router-link>
            <router-link to="/profile" v-if="isLogged" class="nav-item nav-link px-2">Settings</router-link>
            <router-link to="/contacts" class="nav-item nav-link px-2">Contacts</router-link>
        </ul>
        <div class="col-md-3">
            <div v-if="!isLogged">
                <a role="button" class="btn btn-light mx-2"  href="#/login">Sign In</a>
                <a role="button" class="btn btn-outline-success" href="#/register">Sign Up</a>
            </div>
            <div v-else class="dropdown">
                <a role="button" class="btn btn-light link-body-emphasis text-decoration-none" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="true">
                    <img src="../assets/icons/person-circle.svg" alt="mdo" width="30" height="30" class="rounded-circle">
                    <p class="d-inline mx-2 mb-0 text-truncate" ><small>{{ first_name }}</small></p>
                </a>
                <ul class="dropdown-menu text-small" data-popper-placement="bottom-end" style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(0px, 34.4px, 0px);">
                    <li> <router-link to="/addwhiteboard" class="dropdown-item">New Project</router-link></li>
                    <li><router-link to="/profile" class="dropdown-item">Settings</router-link></li>
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
            isLogged: false,
            first_name: '',
            defaultRefreshTimeoutMs: 1000 * 60 * 8
        }
    },
    methods: {
        reloadNavbar() {
            if (localStorage.getItem('accessToken') && !this.isLogged) {
                axios.post('http://localhost:4000/auth/refresh', {
                    accessToken: localStorage.getItem('accessToken'),
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }, withCredentials: true
                }).then(response => {
                    this.isLogged = true;
                    this.first_name = localStorage.getItem("name")
                    console.log("Loggato")
                    this.$forceUpdate();
                    // REFRESH TOKEN EVERY 8 minutes (or so)
                    setInterval(() => {
                        axios.post('http://localhost:4000/auth/refresh', {
                            accessToken: localStorage.getItem('accessToken'),
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }, withCredentials: true
                        }).then(refresh => {
                            console.log(refresh);
                            localStorage.setItem('accessToken', refresh.data.token);
                        }).catch(error => {
                            console.log(error);
                            this.logout();
                        })
                    }, this.defaultRefreshTimeoutMs)
                }).catch(error => {
                    console.log(error)
                    console.log("Errore")
                    this.isLogged = false;
                });
            }
        },
        logout() {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("name")
            localStorage.removeItem("userId")
            this.first_name = ''
            this.isLogged = false
            this.$router.replace({ path: '/' })
        },
        changeName(name) {
            this.first_name = name;
        }
    },
    updated: function() {
        this.reloadNavbar();
    },
    mounted: function() {
        this.reloadNavbar();
    }
}
</script>