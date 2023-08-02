<template>
    <div class="row pb-3">
      <template v-for="(user,index) in this.onlineUser">
          <div class="col" @mouseover="hover[index] = true" @mouseleave="hover[index] = false" style="height: 40px"><Identicon :seed="user"></Identicon></div>
          <div class="col align-middle" v-if="true"><p>{{user}}</p></div>
      </template>
    </div>
</template>

<script>
import {socket} from "@/scripts/socket";
import Identicon from "@/components/Identicon.vue";

export default {

    name: "ActiveUserInWhiteboard",
    components: {Identicon},
    data() {
        return {
            onlineUser: [],
            hover: [],
        };
    },
    created() {
        socket.on('allConnectedUsers', (usernames) => {
            this.onlineUser = usernames;
        })
    },
    mounted() {
        socket.on("user-connected", (username) => {
            if(!this.onlineUser.includes(username)){
                this.onlineUser.push(username);
            }
        });
        socket.on("user-disconnected", (username) =>{
            if(this.onlineUser.includes(username)){
                this.onlineUser.splice(this.onlineUser.indexOf(username),1);
            }
        })
    },
    unmounted() {
        this.onlineUser = [];
    }
}
</script>

<style scoped>
#front {
    overflow: hidden;
    overflow-wrap: break-word;
}

.vcenter-item{
    display: flex;
    align-items: center;
}

container {
    position: relative;
    height: auto;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>