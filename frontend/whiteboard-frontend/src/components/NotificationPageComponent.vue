<template>
<div class="row p-2" v-for="notif in notification">
      <div class="col-lg-4"></div>
      <div class="col-lg-4 col-12">
          <div class="card shadow-lg">
              <div class="card-body">
                  <h5 class="card-title">{{notif.title}}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">{{notif.from}}</h6>
                  <p class="card-text">{{notif.body}}</p>
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
          notification: [{title: "notifica 1", from:"valerio@diz.it", body: "hellooooo, prova 1 dewidhfeiwhfeihfwif"},
              {title: "notifica 2", from:"valeriweweweo@diz.it", body: "hellooooo, prova ficwebfiuwgfeuwhgfvhwfvewhfview dewidhfeiwhfeihfwif"},
              {title: "notifica 3", from:"vaio@diz.it", body: "hellooooo, prova2132312312 dewidhfeiwhfeihfwif"}]
      }
    },
    mounted() {
      this.getNotification();
    },
    methods: {
        getNotification(){
            axios.get('http://localhost:4000/profile/notifications/', {
                params: {
                    accessToken: localStorage.getItem("accessToken")
                }
            }).then(response => {
                this.notification = response.data;
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