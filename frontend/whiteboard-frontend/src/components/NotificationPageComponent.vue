<template>
<div class="row p-2" v-for="notif in notification">
      <div class="col-lg-4"></div>
      <div class="col-lg-4 col-12">
          <div class="card shadow-lg">
              <div class="card-body">
                  <div class="row pb-3">
                      <div class="col-2 rounded justify-content-center"  style="background-color: lightgreen; color: black" v-if="notif.visualized">
                          <i class="bi bi-envelope-open-fill"></i>
                      </div>
                      <div class="col-2 rounded justify-content-center"  style="background-color: #f44336; color: white" v-if="!notif.visualized">
                          <i class="bi bi-envelope-fill"></i>
                      </div>
                      <div class="col-8"><p class="card-text">{{notif.body}}</p> </div>
                      <div class="col-2"></div>
                  </div>
                  <div class="row">
                      <div class="col-6"></div>
                      <div class="col-6">
                        <a @click="this.deleteNotification(notif._id)" class="btn btn-sm btn-danger card-link"><i class="bi bi-trash"></i> Delete</a>
                        <a @click="this.setVisualized(notif._id)" class="btn btn-sm btn-info card-link" v-if="!notif.visualized"><i class="bi bi-check-circle-fill"></i> Mark as read</a>
                        <a class="btn btn-sm btn-info card-link disabled" v-if="notif.visualized"><i class="bi bi-check-circle-fill"></i> Readed</a>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="col-lg-4"></div>
</div>
</template>

<script>

import axios from "axios";

export default {
    name: "NotificationPageComponent",
    data(){
      return{
          notification: []
      }
    },
    mounted() {
      this.getNotification();
    },
    created() {
        /*
        axios.post('http://localhost:4000/profile/addNotification/', {
            accessToken: localStorage.getItem("accessToken"),
            notification: {body: localStorage.getItem("username") + " ti ha invitato a collaborare ad una sua lavagna!", visualized: false},
            username: 'v@v.it'
        })

         */
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

</style>