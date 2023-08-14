<template>
<div class="row p-2" v-for="notif in notification">
      <div class="col-lg-4"></div>
      <div class="col-lg-4 col-12">
          <div class="card shadow-lg">
              <div class="card-body">
                  <div class="row">
                      <div class="col-2" v-if="notif.visualized"></div>
                      <div class="col-2 rounded justify-content-center"  style="background-color: #f44336; color: white" v-if="!notif.visualized">NEW!</div>
                      <div class="col-8"><p class="card-text">{{notif.body}}</p> </div>
                      <div class="col-2"></div>
                  </div>
                  <a href="#" class="card-link">Delete</a>
                  <a href="#" class="card-link">Mark as read</a>
              </div>
          </div>
      </div>
      <div class="col-lg-4"></div>
</div>
</template>

<script>

import axios from "axios";

export default {
    name: "ContactsComponent",
    data(){
      return{
          notification: []
      }
    },
    mounted() {
      this.getNotification();
    },
    methods: {
        getNotification(){
            axios.get('http://localhost:4000/profile/notifications/', {
                params: {
                    accessToken: localStorage.getItem("accessToken"),
                }
            }).then(response => {
                this.notification = response.data.notification;
            }).catch(error => {
                this.$emit("onBadToken");
                console.log(error)
            })
        }
    }
}
</script>

<style scoped>

</style>