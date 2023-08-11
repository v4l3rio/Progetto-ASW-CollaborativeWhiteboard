<template>
    <div class="dropdown">
        <a role="button" class=" text-decoration-none" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="true">
            <div>
              <BootstrapIcon icon="bi bi-person-fill" size="2.3rem" color="black"></BootstrapIcon>
            </div>
        </a>
        <ul class="dropdown-menu text-small" data-popper-placement="bottom-end"
            style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(0px, 34.4px, 0px);">
            <li> <router-link to="/addwhiteboard" class="dropdown-item">New Project</router-link></li>
            <li><router-link to="/profile" class="dropdown-item">Settings</router-link></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item  link-danger" role="button" @click="logout">Esci</a></li>
        </ul>
    </div>
</template>

<script>


import BootstrapIcon from "@/components/BootstrapIcon.vue";
export default {
    name: "NavbarUserDropdown",
    props: ['first_name'],
    components: {BootstrapIcon}
}
</script>

<style scoped>

</style>