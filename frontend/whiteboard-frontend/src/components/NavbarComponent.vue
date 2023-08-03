<template>
    <nav class="row nav-container mb-4">
      <div class="col-3 menu-mobile">
        <a class="menu-mobile-button" data-bs-toggle="collapse" href="#menuMobileCollapse"
           role="button" aria-expanded="false" aria-controls="menuMobileCollapse">
          <BootstrapIcon icon="bi bi-list" size="2.3rem" color="black"></BootstrapIcon>
        </a>
      </div>
      <div class="col logo-container">
        <router-link to="/" class="col-md-3 mb-2 mb-md-0">
          <img class="logo" src="../assets/icons/Logo.png" width="675" height="190" alt="Site Logo">
        </router-link>
      </div>

      <ul class="links-desktop nav nav-pills col text-center align-items-center justify-content-center ">
        <li v-for="link in this.links"><router-link v-if="(link.loginNeeded && this.isLogged) || (!link.loginNeeded)"
                      :to="link.href" class="nav-item nav-link px-2 navbar-links">{{link.name}}</router-link></li>
      </ul>
        <div class="col links-desktop d-flex align-items-center justify-content-center">
            <div v-if="!isLogged">
                <a role="button" class="btn btn-light mx-2"  href="#/login">Sign In</a>
                <a role="button" class="btn btn-outline-success" href="#/register">Sign Up</a>
            </div>
            <div v-else class="dropdown">
                <a role="button" class="btn btn-light link-body-emphasis text-decoration-none" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="true">
                    <IdenticonComponent style="width: 30px; height: 30px;" v-bind:seed="username"></IdenticonComponent>
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
      <div class="col-3 menu-mobile">
        <div v-if="!isLogged">
          <a role="button" href="#/login">
            <BootstrapIcon icon="bi bi-box-arrow-in-right" size="1.8rem" color="black"></BootstrapIcon>
          </a>
        </div>
        <div v-else>
          <NavbarUserDropdown :first_name="this.first_name"></NavbarUserDropdown>
        </div>
      </div>
      <div class="collapse menu-mobile" id="menuMobileCollapse">
        <div class="collapse-body">
          <ul>
            <li v-for="link in this.links">
              <div v-if="(link.loginNeeded && this.isLogged) || (!link.loginNeeded)">
                <router-link  :to="link.href" class="navbar-links">{{ link.name }}</router-link>
                <hr/>
              </div>

            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>
<script>
import axios from "axios";
import IdenticonComponent from "@/components/Identicon.vue";
import {socket} from "@/scripts/socket";
import BootstrapIcon from "@/components/BootstrapIcon.vue";
import NavbarUserDropdown from "@/components/NavbarUserDropdown.vue";
export default {
    name: 'NavbarComponent',
    props: ['loginStatus'],
    components: {
      NavbarUserDropdown,
      BootstrapIcon,
        IdenticonComponent
    },
    data() {
        return {
            isLogged: false,
            first_name: '',
            defaultRefreshTimeoutMs: 5 * 60 * 1000,
            username: '',
            links: [{href: "/", name: "Home", loginNeeded: false}, {href: "/contacts", name: "Contacts", loginNeeded: false},
              {href: "/addwhiteboard", name: "Whiteboards", loginNeeded: true}, {href: "/profile", name: "Profile", loginNeeded: true}, ]
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
                    socket.emit("joinApplication", localStorage.getItem('accessToken'));
                    this.isLogged = true;
                    this.first_name = localStorage.getItem("name")
                    this.username = localStorage.getItem("username")
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
                    localStorage.removeItem("accessToken");
                    this.isLogged = false;
                });
            }
        },
        logout() {
            socket.emit('disconnectApplication', localStorage.getItem('accessToken'));
            localStorage.removeItem("accessToken")
            localStorage.removeItem("name")
            localStorage.removeItem("userId")
            localStorage.removeItem("username")
            localStorage.removeItem("base64")
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  list-style-type: none;
}

.menu-mobile {
  display: none;
}

.logo {
  max-width: 135px;
  max-height: 38px;
}

.nav-container {
  background-color: white;
  box-shadow: 0 1px 2px #cecece;
  min-height: 77px;
}

@media (max-width: 600px) {

  .menu-mobile {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .menu-mobile-button {
    transition: all 300ms ease;
  }
  .menu-mobile-button:active {
    filter: brightness(50%);
  }
  .links-desktop {
    display: none;
  }

  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .nav-container {
    min-height: 80px;
  }
  .logo {
    display: inline-block;

  }
  .collapse-body {
    padding: 10px;
  }

  .navbar-links {
    font-size: 1rem;
    display: block;
    margin: 15px;
    text-decoration: none;
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ccc;
    margin: 1em 0;
    padding: 0;
  }

}

</style>