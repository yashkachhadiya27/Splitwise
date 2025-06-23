<template>
  <v-dialog
    v-model="dialog"
    max-width="400px"
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        class="details-btn"
        variant="text"
        @click="getGroupDetails"
      >
        Group Details
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2" style="font-size: 24px"
        >Group Details</v-card-title
      >

      <div class="image-container">
        <v-avatar class="group-image" size="120">
          <img src="https://picsum.photos/536/354" alt="Avatar" />
        </v-avatar>
      </div>

      <div class="group-info">
        <!-- Group name -->
        <h1>{{ groupName }}</h1>
        <!-- Group description -->
        <p>{{ groupDescription }}</p>
        <!-- Members -->
        <!-- <div class="members"> -->
        <!-- <h4>Members:</h4> -->
        <!-- <ul>
          <li v-for="member in members" :key="member.id">{{ member.name }}</li>
        </ul> -->
        <v-card class="mx-auto" max-width="300">
          <v-list density="compact">
            <v-list-subheader>MEMBERS</v-list-subheader>

            <v-list-item
              v-for="item in details"
              :key="item.id"
              :value="item.id"
              color="primary"
            >
              <!-- <template v-slot:prepend>
          <v-icon>{{item.image}}</v-icon>
        </template> -->

              <v-container class="align-left d-flex" fluid>
                <v-avatar class="mr-4 user-image">
                  <img :src="item.image" alt="Profile Image" />
                </v-avatar>
                <span>{{ item.name }}</span>
              </v-container>

              <!-- <template v-slot:append>
              <v-btn
                icon="mdi-menu-down"
                size="small"
                variant="text"
              ></v-btn>
            </template> -->

              <template v-slot:append v-if="loggedUserData.role <= 2">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-menu-down"
                      v-bind="props"
                      variant="plain"
                    ></v-btn>
                  </template>

                  <v-list v-if="item.id != loggedUserData.id">
                    <v-list-item
                      @click="removeParticipant(item.id)"
                      v-if="loggedUserData.role <= 2 && item.role != 1"
                      >Remove</v-list-item
                    >
                    <v-list-item
                      @click="dismissAsAdmin(item.id)"
                      v-if="loggedUserData.role <= 2 && item.role == 2"
                      >Dismiss as Admin</v-list-item
                    >
                    <v-list-item
                      @click="promoteAsAdmin(item.id)"
                      v-if="loggedUserData.role <= 2 && item.role == 3"
                      >Make Group Admin</v-list-item
                    >
                  </v-list>
                </v-menu>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
        <!-- </div> -->
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "GroupDetails",
  props: ["group_id"],
  data() {
    return {
      dialog: false,
      details: [],
      group_details: [],
      groupName: "",
      groupDescription: "",
      userDetails: JSON.parse(localStorage.getItem("user-info")),
      isUserLogged: false,
      loggedUserData: "",
      // members:[
      //   { text: 'Real-Time', icon: 'mdi-clock' },
      //   { text: 'Audience', icon: 'mdi-account' },
      //   { text: 'Conversions', icon: 'mdi-flag' },
      // ],
    };
  },
  methods: {
    async getGroupDetails() {
      await axios
        .get(
          `http://localhost:3000/api/groups/groupMembersAndDetails/${this.group_id}`
        )
        .then((response) => {
          this.details = response.data.groupDetails;
          this.groupName = this.details[0].group_name;
          this.groupDescription = this.details[0].group_description;
          if (this.details[0].creator_id == this.userDetails.id) {
            this.isUserLogged = true;
          }

          this.loggedUserData = this.details.find((item) => {
            return item.user_id == this.userDetails.id;
          });

          console.log("Logged In User: " + JSON.stringify(this.loggedUserData));
          console.log("members details are", this.details);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async removeParticipant(user_id) {
      console.log(user_id);
      await axios
        .post(`http://localhost:3000/api/groups/removeMemberGroup`, {
          user_id: user_id,
          group_id: this.group_id,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async dismissAsAdmin(user_id) {
      await axios
        .put(`http://localhost:3000/api/groups/dismissAdminGroup`, {
          user_id: user_id,
          group_id: this.group_id,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async promoteAsAdmin(user_id) {
      await axios
        .put(`http://localhost:3000/api/groups/promoteAdminGroup`, {
          user_id: user_id,
          group_id: this.group_id,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 8px;
  overflow: hidden;
}

.v-card-title {
  font-weight: bold;
  color: #080b0d;
  padding-bottom: 0;
}

.v-btn {
  min-width: 0;
}

@media (max-width: 600px) {
  .v-simple-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  thead tr th,
  tbody tr td {
    white-space: nowrap;
  }
  tbody tr td {
    min-width: 100px;
  }
}

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: opacity 0.3s ease;
}
.dialog-bottom-transition-enter,
.dialog-bottom-transition-leave-to {
  opacity: 0;
}

.v-dialog,
.v-btn {
  outline: none;
}

.details-btn {
  text-transform: none;
}

.details-btn::first-letter {
  text-transform: capitalize;
}

.group-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-container {
  margin-top: 20px;
}

.group-image {
  margin-top: 50px;
  border: 3px solid #000;
  border-radius: 50%;
  width: 100px; /* Adjust as needed */
  height: 100px; /* Adjust as needed */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}

.group-info {
  margin-top: 10px;
  text-align: center;
}

.members {
  margin-left: 0;
  margin-top: 20px;
}

.members ul {
  list-style-type: none;
  padding: 0;
}

.members li {
  margin-bottom: 5px;
}

.title-right {
  margin-left: 20px; /* Adjust the left margin as needed */
}

.user-image {
  margin-left: 0px;
}
</style>
