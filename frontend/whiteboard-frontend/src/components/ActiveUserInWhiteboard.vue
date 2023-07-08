<template>
    <p style="font-weight: bold;">Utenti connessi</p>
      <div class="col pt-3" v-for="user in this.onlineUser">
          <div class="row shadow rounded border">
              <div class="col-3">
                <Identicon :seed="user" style="width: 20px;" class="col"></Identicon>
              </div>
              <div class="col-9">
                  <container>
                  <div id="front">
                      {{ user }}
                  </div>
              </container>
              </div>
          </div>
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
        };
    },
    created() {
        socket.emit('getAllConnectedUsers');
        socket.on('allConnectedUsers', (usernames) => {
            this.onlineUser = usernames;
        })
    },
    mounted() {
        socket.on("user-connected", (username) => {
            this.onlineUser.push(username);
        });
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

container {
    position: relative;
    height: auto;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>