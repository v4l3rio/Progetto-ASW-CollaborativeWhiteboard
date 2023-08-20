<template>
    <div class="dropdown">
        <a role="button" class=" text-decoration-none hideMobile" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="true">
            <div>
              <BootstrapIcon icon="bi bi-person-fill" size="2.3rem" color="black"></BootstrapIcon>
            </div>
        </a>
      <a role="button" class="btn btn-light link-body-emphasis text-decoration-none hideDesktop" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="true">
        <IdenticonComponent style="width: 30px; height: 30px;" :take-from-storage="true"></IdenticonComponent>
        <p class="d-inline mx-2 mb-0 text-truncate" ><small>{{ first_name }}</small></p>
      </a>
        <ul class="dropdown-menu text-small" data-popper-placement="bottom-end"
            style="position: absolute; inset: 0 0 auto auto; margin: 0; transform: translate3d(0px, 34px, 0px);">
            <li><router-link to="/addwhiteboard" class="dropdown-item">New Project</router-link></li>
            <li><router-link to="/profile" class="dropdown-item">Settings</router-link></li>
            <li><hr class="dropdown-divider active"></li>
            <li><a class="dropdown-item  link-danger" role="button" @click="logout">Logout</a></li>
        </ul>
    </div>
</template>

<script>


import BootstrapIcon from "@/components/BootstrapIcon.vue";
import IdenticonComponent from "@/components/Identicon.vue";
export default {
  name: "NavbarUserDropdown",
  props: ['first_name'],
  emits: ['logout'],
  components: {IdenticonComponent, BootstrapIcon},
  methods: {
    logout() {
      this.$emit("logout")
    }
  }
}
</script>

<style scoped>

.hideMobile {
  display: none;
}
@media screen and (max-width: 930px) {
  .hideDesktop {
    display: none;
  }
  .hideMobile {
    display: inline-block;
  }
}
</style>