<template>
  <form class="container">
    <div class="row border rounded g-3 text-start mb-5">
      <div class="col m-3">
        <h3><strong>Avatar</strong></h3>
        <p>Upload your avatar here</p>
      </div>
      <div class="col m-3">
        <div class="row">
          <div class="col-3 text-center d-flex flex-wrap align-items-center">
            <img src="../assets/icons/eye.svg" width="75" height="75" class="rounded-circle border"/>
          </div>
          <div class="col text-start">
            <p><strong>Upload</strong></p>
            <div class="mb-3">
              <input class="form-control" type="file" id="formFile">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row border rounded g-3 text-start mb-5">
      <div class="col m-3">
        <h3><strong>User Informations</strong></h3>
        <p>This information will appear on your profile</p>
      </div>
      <div class="col m-3">
        <p><strong>Email</strong></p>
        <div class="input-group mb-3">
          <input @input="checkChanges" v-model="email" type="email" class="form-control" placeholder="email" aria-label="Email" aria-describedby="basic-addon1">
        </div>
        <p calss="mb-2"><strong>Name</strong></p>
        <div class="input-group flex-nowrap mb-3">
          <input @input="checkChanges" v-model="name" type="text" class="form-control" placeholder="first name" aria-label="First name" aria-describedby="addon-wrapping">
        </div>
        <p><strong>Surname</strong></p>
        <div class="input-group flex-nowrap mb-3">
          <input @input="checkChanges" v-model="surname" type="text" class="form-control" placeholder="Last name" aria-label="Last name" aria-describedby="addon-wrapping">
        </div>
        <div class="alert alert-danger" role="alert" :hidden="!this.isInvalid">
            Something went wrong
        </div>
        <button type="button" class="btn btn-primary" :disabled="!isEnabled">Update</button>
      </div>
    </div>
    <div class="row border rounded g-3 text-start mb-5">
      <div class="col m-3">
        <h3><strong>Password</strong></h3>
        <p>Manage your password</p>
      </div>
      <div class="col m-3">
        <p><strong>Password</strong></p>
        <div class="input-group mb-3">
          <input v-model="password" type="password" class="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1">
        </div>
        <button type="submit" class="btn btn-primary" @click="updatePassword">Change Password</button>
      </div>
    </div>
  </form>
<FooterComponent></FooterComponent>
</template>
<script>

import axios from "axios";
import FooterComponent from "@/components/FooterComponent.vue"
export default {
  name: 'UserProfileView',
  components: {
    FooterComponent
},
  data() {
    return {
      email: '',
      name: '',
      surname: '',
      password: '',
      image: '',
      isInvalid: false,
      isEnabled: false,
      currentName: '',
      currentSurname: '',
      currentEmail: '',
      password: ''
    }
  },
  methods: {
    getUserData() {
      axios.get('http://localhost:4000/userSetting/', {
        params: {
          accessToken: localStorage.getItem("accessToken")
        }
      }).then(response => {
        var user = response.data
        this.email = user.username
        this.name = user.first_name
        this.surname = user.last_name
        this.currentEmail = user.username
        this.currentName = user.first_name
        this.currentSurname = user.last_name

      }).catch(error => {
        console.log(error)
      })
    },
    updateUserInfo() {
      axios.post('http://localhost:4000/userSetting/updateInfo', {
        email: this.email,
        first_name: this.name,
        last_name: this.last_name
      }).then(response => {

      }).catch(error => {
        this.isInvalid = true
      })

    },
    updatePassword() {
      axios.post('http://localhost:4000/userSetting/updateInfo', {
        password: this.password
      }).then(response => {

      }).catch(error => {
        this.isInvalid = true
      })
    },
    checkChanges() {
      if (this.email !== this.currentEmail || this.name !== this.currentName || this.surname !== this.currentSurname) {
        this.isEnabled = true
      }
    },
  },
  mounted: function () {
    this.getUserData()
  }
}
</script>