<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <div
        v-bind="activatorProps"
        v-if="!isCreateGroupButtonHidden && !isMenuHidden"
        variant="outlined"
        elevation="4"
        color="purple-darken-4"
        class="create-group-btn d-flex align-center justify-center cursor-pointer"
      >
        <!-- <v-icon left color="purple-darken-4">mdi-pencil</v-icon> -->
        Edit Group
      </div>

      <v-btn v-else-if="!isMenuHidden" icon class="profile-avatar">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Edit Group Details</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="groupName"
            label="Group Name"
            required
          ></v-text-field>
          <v-textarea
            v-model="groupDescription"
            label="Group Description"
            required
          ></v-textarea>
          <v-container class="d-flex align-center justify-center" fluid>
            <v-file-input
              v-model="image"
              label="Group Icon"
              accept="image/*"
              required
              class="mr-2 pr-2"
              @change="updateImageURL"
            ></v-file-input>

            <v-img
              :width="100"
              :height="100"
              aspect-ratio="1/1"
              :src="imageURL"
            ></v-img>
          </v-container>

          <!-- <v-autocomplete
              v-model="selectedParticipants"
              :items="participants"
              item-title="username"
              item-value="username"
              label="Search Participants"
              @input="searchParticipants"
              multiple
              clear-on-select="true"
            ></v-autocomplete>
   -->
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="updateGroup">Update</v-btn>
        <v-btn color="error" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "EditGroupDetails",
  props: [
    "isCreateGroupButtonHidden",
    "isMenuHidden",
    "windowWidth",
    "group_id",
  ],
  data() {
    return {
      dialog: false,
      searchQuery: "",
      groupName: "",
      groupDescription: "",
      image: null,
      selectedParticipants: [],
      participants: [],
      userInfo: JSON.parse(localStorage.getItem("user-info")),
      imageURL: null,
    };
  },
  methods: {
    async updateGroup() {
      if (this.$refs.form.validate()) {
        if (this.image == this.imageURL) {
          await axios
            .put(`http://localhost:3000/api/groups/update/${this.group_id}`, {
              group_name: this.groupName,
              group_description: this.groupDescription,
              image :this.image
            })
            .then((response) => {
              this.$emit("groupUpdated", response.data);
              this.closeDialog();
              this.$emit("successToast");
              this.$refs.form.reset();
              this.$refs.form.resetValidation();
              this.image = null;
              this.selectedParticipants = [];
              this.participants = [];
            })
            .catch((error) => {
              console.error("Error updating group:", error);
              this.$emit("errorToast");
            });
        } else {
          const formData = new FormData();
          formData.append("group_name", this.groupName);
          formData.append("group_description", this.groupDescription);
          formData.append("GroupImage", this.image);
          //   formData.append(
          //     "participants",
          //     JSON.stringify(this.selectedParticipants)
          //   );
          //   formData.append("creator_id", this.userInfo.id);

          await axios
            .put(
              `http://localhost:3000/api/groups/update/${this.group_id}`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            )
            .then((response) => {
              this.$emit("groupUpdated", response.data);
              this.closeDialog();
              this.$emit("successToast");
              this.$refs.form.reset();
              this.$refs.form.resetValidation();
              this.image = null;
              this.selectedParticipants = [];
              this.participants = [];
            })
            .catch((error) => {
              console.error("Error updating group:", error);
              this.$emit("errorToast");
            });
        }
      }
    },
    async searchParticipants(event) {
      this.searchQuery = event.target.value;

      if (this.searchQuery.length >= 3) {
        await axios
          .get(`http://localhost:3000/api/user/users/${this.searchQuery}`)
          .then((response) => {
            this.participants = response.data.users;

            console.log("Participants: " + JSON.stringify(this.participants));
          })
          .catch((error) => {
            console.error("Error fetching participants:", error);
          });

        // const response = await axios.get(`http://localhost:3000/api/user/users/${this.searchQuery}`);
        // const data = await response.data.users;
        // console.log(JSON.stringify(data))
        // console.log('first')
        // this.participants = data;
      }
    },
    addParticipants() {
      this.selectedParticipants = this.participants.filter(
        (participant) => participant.selected
      );
      console.log(this.selectedParticipants);
    },
    closeDialog() {
      this.dialog = false;
    },
    getGroupDetails() {
      const response = axios
        .get(`http://localhost:3000/api/groups/groupDetails/${this.group_id}`)
        .then((response) => {

          // console.log("Group Data ", response.data.group[0]);
          this.groupName = response.data.group[0].group_name;
          this.groupDescription = response.data.group[0].group_description;
          this.imageURL = response.data.group[0].group_icon;
          this.image = response.data.group[0].group_icon;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    updateImageURL(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageURL = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
  async created() {
    this.getGroupDetails();
  },
};
</script>

<style scoped>
.create-group-btn {
  margin-right: 16px;
}

.profile-avatar {
  margin-right: 10px; /* Adjust margin as needed */
  margin-left: 16px;
  border: 3px solid #673ab7;
}
</style>
