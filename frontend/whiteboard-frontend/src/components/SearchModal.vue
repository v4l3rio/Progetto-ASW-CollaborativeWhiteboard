<template>
    <div class="modal" tabindex="-1" id="searchModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Invite to Whiteboard {{name}}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <span>Search users to add to this whiteboard</span>
                    <div class="m-1">
                        <Spinner v-if="this.loading"></Spinner>
                    </div>

                    <div class="mb-3">
                            <div class="dropdown">
                                <label for="dropdownSearch" class="form-label">Username</label>
                                <div class="row">
                                    <input type="text" class="form-control" id="dropdownSearch" placeholder="name@example.com"
                                           @focusin="focusIn" @click="click"
                                           @focusout="focusOut" @input="inputChange" data-bs-toggle="dropdown" aria-expanded="true"
                                            autocomplete="off">
                                    <ul class="dropdown-menu" aria-labelledby="dropdownSearch">
                                        <li v-for="user in foundUsers">

                                                <a class="dropdown-item" v-bind:class="{disabled: user.alreadyIn}"
                                                   role="button" @click="invite(user.username)">
                                                    <div class="m-1" style="width: 30px; display: inline-block; vertical-align: middle">
                                                        <Identicon :seed="user.username"></Identicon>
                                                    </div>
                                                    {{user.username}}
                                                    <span v-if="user.alreadyIn">(Already on the whiteboard)</span>
                                                </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>


                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" ref="closeBtn">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Spinner from "@/components/Spinner.vue";
import axios from "axios";
import Identicon from "@/components/Identicon.vue";

const $ = document.querySelector.bind(document);

export default {
    name: "SearchModal",
    components: {Identicon, Spinner},
    data() {
        return {
            dropDownOn: false,
            searchCoolDown: null,
            coolDownMillis: 500,
            loading: false,
            foundUsers: [],
            isFocus: false
        }
    },
    props: {
        name: String,
        whiteboardId: Number
    },
    emits: ["invited"],
    methods: {
        focusIn(){
            this.inputChange();
            this.isFocus = true;
        },
        focusOut(){
            this.isFocus = false;
        },
        click() {
            this.dropDownOn = !this.dropDownOn;
        },
        inputChange(input) {
            if (this.isFocus && !this.dropDownOn) {
                $("#dropdownSearch").click();
            }
            const query = input?.srcElement.value.trim();
            if (query) {
                this.loading = true;
                clearTimeout(this.searchCoolDown);
                this.searchCoolDown = setTimeout(() => {
                    this.search(query);
                }, this.coolDownMillis);
            }
        },
        search(query) {
            if (!query) {
                this.foundUsers = [];
            } else {
                axios.get('http://localhost:4000/profile/users', {
                    params: {
                        accessToken: localStorage.getItem("accessToken"),
                        filters: {username: query, whiteboardId: this.whiteboardId}
                    }
                }).then(response => {
                    this.foundUsers = response.data.users;
                    console.log(response.data.users);
                    this.loading = false;
                }).catch(error => {
                    console.log(error);
                    this.loading = false;
                })
            }
        },
        invite(username) {
            console.log("Inviting " + username);
            axios.put("http://localhost:4000/whiteboard/invite", {
                accessToken: localStorage.getItem("accessToken"),
                username: username,
                whiteboardId: this.whiteboardId
            }).then(result => {
                console.log(result)
                this.$emit("invited", username);
            }).catch(error => {
                console.log(error.response.data.message)
            })
        }
    }
}
</script>

<style scoped>

</style>