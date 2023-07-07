<template>
  <div class="container text-start">
      <Alert v-if="alertOn" :text="alertText" :close-click="() => {alertOn = false;}"></Alert>
    <div class="row row-cols-1 row-cols-sm-5 g-3">
      <AddWhiteboardComponent v-bind:addProps="addProps" @add-whiteboard=""></AddWhiteboardComponent>
    </div>
      <SearchModal v-bind:name="whiteboardInviteName"></SearchModal>
      <ModalWithButton modal-id="whiteboardModal" ref="createModal" title="Create a Whiteboard"
                       :click="createWhiteboard" button-text="Create">
          <p>Insert a name for the whiteboard</p>
          <div class="input-group flex-nowrap mb-3">
              <span class="input-group-text" id="modalNameInput">Whiteboard name</span>
              <input type="text" v-model="whiteboardCreateName" class="form-control" placeholder="Whiteboard Name" aria-label="Whiteboard Name" aria-describedby="addon-wrapping">
          </div>
      </ModalWithButton>
      <ModalWithButton modal-id="whiteboardModalRename" ref="renameModal" title="Rename the Whiteboard"
                       :click="renameWhiteboard" button-text="Rename">
          <p>Insert a  new name for the whiteboard</p>
          <div class="input-group flex-nowrap mb-3">
              <span class="input-group-text" id="modalNameInput">Whiteboard name</span>
              <input type="text" v-model="whiteboardRenameName" class="form-control" placeholder="Whiteboard New Name" aria-label="Whiteboard New Name" aria-describedby="addon-wrapping">
          </div>
      </ModalWithButton>
    <h1 class="h3 mb-3">Your files</h1>
      <div v-if="loading" class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
      </div>
    <div class="row row-cols-1 row-cols-md-4 g-4">
      <CardPlaceholderComponent v-if="!isReady"></CardPlaceholderComponent>
      <CardComponent @card-deleted="deleteWhiteboard" @card-renamed="openRenameModal" @invite-to-whiteboard="setInviteWhiteboard"
                     v-bind:whiteboards="whiteboards"
                     v-else-if="whiteboards?.length !== 0">

      </CardComponent>
      <div class="col align-self-center" v-else>Add a new whiteboard to start</div>
    </div>
  </div>
</template>
<script>
import CardPlaceholderComponent from "@/components/CardPlaceholderComponent.vue"
import CardComponent from "@/components/CardComponent.vue"
import AddWhiteboardComponent from "@/components/AddWhiteboardComponent.vue"
import ImportWhiteboardComponent from "@/components/ImportWhiteboardComponent.vue"
import NavbarComponent from "@/components/NavbarComponent.vue"

import axios from "axios";
import ModalWithButton from "@/components/ModalWithButton.vue";
import Alert from "@/components/Alert.vue";
import Identicon from "@/components/Identicon.vue";
import SearchModal from "@/components/SearchModal.vue";
export default {
  name: 'AddWhiteboardView',
  data() {
    return {
      isReady: false,
      loading: false,
      alertOn: false,
      alertText: "",
      addProps: [
        { title: 'Add new whiteboard', icon: "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z", color: 'btn-outline-primary', alt: 'add whiteboard plus icon'},
      ],
      importProps: [
        { title: 'Import whiteboard', icon: "M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z", color: 'btn-outline-secondary', alt: 'import whiteboard arrow up icon'},
      ],
      whiteboardCreateName: "",
      whiteboardRenameName: "",
      whiteboardInviteName: "",
      inviteId: -1,
      renameId: -1,
      whiteboards: []
    }
  },
  components: {
      SearchModal,
      Identicon,
      Alert,
      ModalWithButton,
    CardComponent,
    CardPlaceholderComponent,
    AddWhiteboardComponent,
    ImportWhiteboardComponent,
    NavbarComponent
  },
  methods: {
    getWhiteboards() {
      this.loading = true;
      axios.get('http://localhost:4000/profile/', {
        params: {
          accessToken: localStorage.getItem("accessToken")
        }
      }).then(response => {
        this.isReady = true;
        this.loading = false;
        const wb = [];
        const data = response.data.whiteboards;
        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                wb.push(data[i]);
            }
        }
        this.whiteboards = wb;
        this.alertOn = false;
      }).catch(error => {
        console.log(error)
        this.loading = false;
        this.showAlert(error.response?.data?.message);
      })
    },
    importWhiteboard () {

    },
    setInviteWhiteboard(whiteboard) {
        this.inviteId = whiteboard.id;
        this.whiteboardInviteName = whiteboard.name;
    },
    createWhiteboard () {
        this.$refs.createModal.close();

        if (this.whiteboardCreateName) {
            this.loading = true;
            axios.post('http://localhost:4000/profile/createWhiteboard', {
                accessToken: localStorage.getItem("accessToken"),
                whiteboardName: this.whiteboardCreateName
            }).then(response => {
                console.log(response.data.message);
                this.whiteboardCreateName = "";
                this.alertOn = false;
                this.loading = false;
                this.getWhiteboards();
            }).catch(error => {
                this.whiteboardCreateName = "";
                this.showAlert(error.response.data.message);
                this.loading = false;
            })
        }
    },
    showAlert(text) {
        this.alertOn = true;
        this.alertText = text;
    },
    deleteWhiteboard (id) {
        console.log(id)
        const token = localStorage.getItem("accessToken");
        console.log(token)
      axios.delete('http://localhost:4000/profile/deleteWhiteboard', {"data": {
              accessToken: token,
              whiteboardId: id
          }}).then(result => {
          this.getWhiteboards();
      }).catch(error => {
          this.showAlert(error.response.data.message);
          this.loading = false;
      });
    },
    openRenameModal(id) {
      this.renameId = id;
    },
    renameWhiteboard() {
      this.$refs.renameModal.close();
      console.log(this.renameId)
      axios.put('http://localhost:4000/profile/updateWhiteboard', {
        accessToken: localStorage.getItem("accessToken"),
        whiteboardId: this.renameId,
        newName: this.whiteboardRenameName
      }).then(response => {
          this.getWhiteboards();
          this.loading = false;
          console.log(response.data.message);
          this.whiteboardRenameName = "";
          this.alertOn = false;
      }).catch(error => {
          this.whiteboardRenameName = "";
          this.showAlert(error.response.data.message);
          this.loading = false;
      });
    }
  },
  mounted: function () {
    this.getWhiteboards();
  }
}
</script>
