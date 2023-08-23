<template>
    <ul class="row pb-3 activeUsers">
      <template v-for="(user,index) in this.onlineUsers" :key="user">
          <div class="col" @mouseover="hover[index] = true" @mouseleave="hover[index] = false" style="height: 40px"><Identicon :seed="user"></Identicon></div>
          <div class="col align-middle hideDesktop" v-if="hover[index]"><p>{{user}}</p></div>
      </template>
    </ul>
</template>

<script>
import {socket} from "@/scripts/socket";
import Identicon from "@/components/common/Identicon.vue";

export default {

    name: "ActiveUserInWhiteboard",
    components: {Identicon},
    data() {
        return {
            onlineUsers: [],
            hover: [],
        };
    },
    created() {
        socket.on('allConnectedUsers', (usernames) => {
            this.onlineUsers = usernames;
        })
    },
    mounted() {
        socket.on("user-connected", (username) => {
            if(!this.onlineUsers.includes(username)){
                this.onlineUsers.push(username);
            }
            console.log(this.onlineUsers)
        });
        socket.on("user-disconnected", (username) =>{
            if(this.onlineUsers.includes(username)){
                this.onlineUsers.splice(this.onlineUsers.indexOf(username),1);
            }
          console.log(this.onlineUsers)

        })
    },
    unmounted() {
        this.onlineUsers = [];
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

.activeUsers {
  list-style-type: none;
  margin-bottom: 0;
  padding-left: 0;
  flex-direction: row;
}
container {
    position: relative;
    height: auto;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
}

@media screen and (max-width: 720px) {
  .hideDesktop {
    display: none;
  }
}

</style>