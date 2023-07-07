<template>
    <div class="modal" tabindex="-1" id="searchModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Invite to Whiteboard {{name}}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Search users to add to this whiteboard</p>
                    <div class="mb-3">
                        <div class="dropdown">
                            <label for="drowdownMenuButton" class="form-label">Username</label>
                            <input type="email" class="form-control" id="drowdownMenuButton" placeholder="name@example.com"
                                   @focusout="hideDropdown" @input="inputChange" data-bs-toggle="dropdown" aria-expanded="false">
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li><a class="dropdown-item" href="#">Action</a></li>
                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                            </ul>
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
const $ = document.querySelector.bind(document);

export default {
    name: "SearchModal",
    data() {
        return {
            dropDownOn: false
        }
    },
    props: {
        name: String
    },
    methods: {
        inputChange(input) {
            const query = input.srcElement.value;
            if (!this.dropdownOn) {
                this.dropdownOn = true;

            }
        },
        hideDropdown() {
            this.dropdownOn = false;
        }
    }
}
</script>

<style scoped>

</style>