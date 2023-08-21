<template>
  <NavbarComponent v-on:join-application="this.onJoinApplication" ref="navbar"></NavbarComponent>
   <NotificationComponent v-on:notification="this.onLiveNotification"></NotificationComponent>
   <router-view v-on:setCallback="this.setCallback" ref='router' v-on:updateNotificationBadge="this.onVisualizeNotification" v-on:onLogin="this.onLogin" v-on:onBadToken="this.onBadToken" v-on:onChangedInfo="this.onChangedInfo"/>
 </template>

 <style>
 #app {
   font-family: Avenir, Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-align: center;
   color: #2c3e50;
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
   data() {
     return {
       callback: undefined
     }
   },
   components: {NotificationComponent, NavbarComponent},
     methods: {
       onLogin() {
           this.$refs.navbar.reloadNavbar();
       },
       onBadToken() {
           this.$refs.navbar.logout();
       },
       onChangedInfo(name) {
           console.log("Changing " + name)
           this.$refs.navbar.changeName(name)
       },
       onVisualizeNotification(){
         this.$refs.navbar.loadUnreadNotification();
       },
       onLiveNotification(){
         this.$refs.navbar.updateNotificationNumber();
       },
       onJoinApplication(){
         if(this.callback){
           this.callback();
         }
       },
       setCallback(callback){
          this.callback = callback;
       }
     }
 }
 </script>