<template>
    <div class="wrap">
        <div class="whiteBoard"></div>
        <h1><span class="w">W</span>hiteboard</h1>
        <div class="realtime-container">
            <p class="r one">Real</p>
            <p class="r two"><span class="w">time</span></p>
        </div>
        <router-link
            :to="isLogged ? '/addwhiteboard' : '/login'"
            custom
            v-slot="{ navigate }"
        >
        <button
            class="btn btn-primary shadow mt-5"
            @click="navigate"
            role="link">
          {{ isLogged ? "Vai alle lavagne" : "Accedi" }}
        </button>
        </router-link>
        <div class="container">
            <div class="canva1 rounded shadow"><img class="imgSvg" src="../assets/home/home1.svg" alt="Drawing 1"></div>
            <div class="canva2 rounded shadow"><img class="imgSvg" src="../assets/home/home2.svg" alt="Drawing 2"></div>
            <div class="canva3 rounded shadow"><img class="imgSvg" src="../assets/home/home3.svg" alt="Drawing 3"></div>
        </div>
    </div>
</template>
<script>


export default {
    name: 'HomepageComponent',
    data() {
       return {
         isLogged: false
       }
    },
    mounted() {
      this.isLogged = localStorage.getItem('accessToken');
    }
}
</script>
<style scoped>

.imgSvg{
    width: 30vh;
}
.canva1{
    width: 30vh;
    position: absolute;
    top: 15vh;
    z-index: 1;
    left: 0vh;
}
.canva2{
    width: 30vh;
    position: absolute;
    top: 10vh;
    left: -20vh;
    z-index: 2;
}
.canva3{
    width: 30vh;
    position: absolute;
    top: 10vh;
    left: 20vh;
    z-index: 0;
}
.container{
    position: relative;
}

* {
    transition: all 0.3s ease;
    -webkit-animation-fill-mode: both;
}

.wrap {
    width: 100%;
    height: 250px;
    text-align: center;
    zoom: 150%;
    margin-top: 50px;
}

.whiteBoard {
    width: 55px;
    height: 55px;
    border: 5px solid gray;
    position: absolute;
    transform: rotateX(30deg) rotateY(30deg);
    margin-top: 25px;
}

.whiteBoard:before {
    content: ' ';
    width: 55px;
    height: 55px;
    border: 5px solid gray;
    position: absolute;
    transform: translateY(-15px) translateX(-23px) rotateZ(10deg);
    animation: rotateLogoOne 0.75s ease 1;
    -webkit-animation-fill-mode: both;
    animation-delay: 0.2s;
}

.whiteBoard:after {
    content: ' ';
    width: 55px;
    height: 55px;
    border: 5px solid gray;
    position: absolute;
    transform: translateY(-25px) translateX(-13px) rotateZ(20deg);
    animation: rotateLogoTwo 1s ease 1;
    -webkit-animation-fill-mode: both;
    animation-delay: 0.2s;
}

h1, .realtime-container {
    text-align: right;
    font-weight: normal;
    height: 20px;
    font-family: 'Raleway', sans-serif;
    margin-top: 25px;
}

h1 {
  width: 100%;
  text-align: center;
    font-size: 3vw;
    transform: translateX(-30px);
    animation: rotate 0.3s ease 1;
    -webkit-animation-fill-mode: both;
    animation-delay: 0.3s;
}

.w {
    font-family: 'Titillium Web', sans-serif;
}

.realtime-container {
  width: 100%;
  text-align: center;
    color: #979599;
    font-size: 25px;
}

.r {
    margin-top: 0px;
    display: inline-block;
    transform: rotateX(90deg);
    transform-origin: 50% 100%;
}

.one {
    animation: rotate 0.3s ease 1;
    -webkit-animation-fill-mode: both;
    animation-delay: 0.1s;
}

.two {
    animation: rotate 0.3s ease 1;
    -webkit-animation-fill-mode: both;
    animation-delay: 0.75s;
}


@keyframes rotate {
    to {
        transform: rotateX(0deg);
    }
}

@keyframes translate {
    to {
        transform: translateX(0px);
    }
}

@keyframes rotateLogoOne {
    to {
        transform: translateY(-15px) translateX(4px) rotateZ(0deg);
    }
}

@keyframes rotateLogoTwo {
    to {
        transform: translateY(-25px) translateX(13px) rotateZ(0deg);
    }
}

@media screen and (max-width: 500px) {
  p {
    font-size: 14px;
  }
}
</style>