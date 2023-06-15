<template>
    <div class="d-flex justify-content-center">
    <div class="col-4 ">
    <form>
        <h1 class="h3 mb-2">Login</h1>
        <EmailFormComponent></EmailFormComponent>
        <PasswordFormComponent></PasswordFormComponent>
        <!-- Submit button -->
        <div class="form-check text-start my-3">
            <input class="form-check-input" type="checkbox" value="remember me" id="remeberMeCheckBox">
            <label class="form-check-label" for="flexCheckDefault">Remember me</label>
        </div>
        <div class="form-floating mb-3">
            <button type="submit" class="btn btn-primary col-12" id="SignInButton" >Sign in</button>
        </div>

        <!-- Register buttons -->
        <div class="text-center">
            <p>Not a member? <a href="#!">Register</a></p>
        </div>
    </form>
    </div>
    </div>
</template>
<script>
import EmailFormComponent from "@/components/EmailFormComponent.vue"
import PasswordFormComponent from "@/components/PasswordFormComponent.vue";
export default {
    name: 'LoginView',
    components: {
        EmailFormComponent,
        PasswordFormComponent
    },
    methods: {
        enableButton() {

        }
    },
    mounted: function () {
    }
}
</script>