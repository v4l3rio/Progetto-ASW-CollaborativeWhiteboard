<template>
<div class="row p-2" v-for="notif in notification">
      <div class="d-flex justify-content-center align-items-center w-100">
          <div class="toast position-relative">
            <div class="toast-header">
              <i class="bi bi-bell-fill" style="padding-right: 5px"></i>
              <strong class="me-auto">Notifica</strong>
              <small></small>
              <button type="button" class="btn-close" @click="this.deleteNotification(notif._id)" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              {{notif.body}}
            </div>
            <span v-if="!notif.visualized" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">New!</span>
          </div>
      </div>
</div>
</template>

<script>

import axios from "axios";
import {Toast} from "bootstrap";

export default {
    name: "NotificationPageComponent",
    data(){
      return{
        notification: [],
      }
    },
  mounted() {
      this.getNotification();
    },
  beforeUnmount: function() {
     this.notification.filter(function (el){
        return !el.visualized
      }).forEach(toVisualize => {
        this.setVisualized(toVisualize._id);
     })
  },
  methods: {
       getNotification(){
            axios.get('http://localhost:4000/profile/notifications/', {
                params: {
                    accessToken: localStorage.getItem("accessToken"),
                }
            }).then(response => {
                this.notification = response.data.notification;
                this.$emit('updateNotificationBadge');
            }).catch(error => {
                this.$emit("onBadToken");
                console.log(error)
            })
        },
        deleteNotification(id){
            //start spinner
            axios.delete('http://localhost:4000/profile/deleteNotifications/', {
                params: {
                    accessToken: localStorage.getItem("accessToken"),
                    id: id
                }
            }).then(() => {
                // stop spinner
                this.getNotification();
            }).catch(error => {
                // show error
                this.$emit("onBadToken");
                console.log(error)
            })
        },
        setVisualized(id){
            axios.patch('http://localhost:4000/profile/updateNotification/', {
                accessToken: localStorage.getItem("accessToken"),
                id: id
            }).then(() => {
                this.getNotification();
            }).catch(error => {
                this.$emit("onBadToken");
                console.log(error)
            })
        }

    }
}
</script>

<style scoped>
.toast{
  display: block !important;
}
</style>