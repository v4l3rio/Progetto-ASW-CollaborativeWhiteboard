<template>
    <p>Questa pagina di register non funziona, è stata utilizzata solo come esempio per il routing</p>
    <div class="d-flex justify-content-center">
    <div class="col-8">
    <form>
        <!-- Email input -->
        <div class="form-outline mb-4">
            <input type="email" id="email" class="form-control" />
            <label class="form-label" for="email">Email address</label>
        </div>

        <!-- Name input -->
        <div class="form-outline mb-4">
            <input type="email" id="name" class="form-control" />
            <label class="form-label" for="email">Name</label>
        </div>

        <!-- Surname input -->
        <div class="form-outline mb-4">
            <input type="email" id="surname" class="form-control" />
            <label class="form-label" for="surname">Surname</label>
        </div>

        <!-- Password input -->
        <div class="form-outline mb-4">
            <input type="password" id="password" class="form-control" />
            <label class="form-label" for="password">Password</label>
        </div>

        <!-- Confirm input -->
        <div class="form-outline mb-4">
            <input type="password" id="confirmPassword" class="form-control" />
            <label class="form-label" for="confirmPassword">Password</label>
        </div>

        <!-- Submit button -->
        <button type="button" class="btn btn-primary btn-block mb-4">Sign up</button>

        <!-- Login buttons -->
        <div class="text-center">
            <p>Already a member? <a href="#/login">Login</a></p>
            <p>or sign up with:</p>
            <button type="button" class="btn btn-link btn-floating mx-1">
                <i class="fab fa-facebook-f"></i>
            </button>

            <button type="button" class="btn btn-link btn-floating mx-1">
                <i class="fab fa-google"></i>
            </button>

            <button type="button" class="btn btn-link btn-floating mx-1">
                <i class="fab fa-twitter"></i>
            </button>

            <button type="button" class="btn btn-link btn-floating mx-1">
                <i class="fab fa-github"></i>
            </button>
        </div>
    </form>
    </div>
    </div>
</template>
<script setup>
</script>