<template>
  <nav>
      <div class="row">
          <div class="col"></div>
          <router-link to="/" class="col">Home</router-link>
          <!--<router-link to="/whiteboard/" class="col">Whiteboard</router-link>-->
          <router-link to="/login" class="col">Login</router-link>
          <router-link to="/addWhiteboard" class="col">Files</router-link>
          <router-link to="/register" class="col">Register</router-link>
          <router-link to="/profile" class="col">Profile</router-link>
         <NotificationComponent class="col"></NotificationComponent>
      </div>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

@import'~bootstrap/dist/css/bootstrap.css';
</style>
<script>
import NotificationComponent from "@/components/NotificationComponent.vue";
import NavbarComponent from "@/components/NavbarComponent.vue"
export default {
  name: "App",
  components: {NavbarComponent}
}
</script>