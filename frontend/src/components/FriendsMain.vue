<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col :cols="showLeftPanel ? 4 : 0" v-if="showLeftPanel">
        <div class="left-panel">
          <v-card flat>
            <v-toolbar class="tool" color="#F8F2FF" dense flat>
            <v-row class="fill-height" no-gutters align="center">
              <v-col cols="5" class="px-0" >
                <v-text-field 
                  hide-details
                  dense
                  variant="solo"
                  color="transparent"
                  placeholder="Search"
                  clearable
                  rounded
                  append-inner-icon="mdi-magnify"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-btn @click="flag" variant="outlined" class="addfriend" style="border: 3px solid blueviolet; ">
                  <span class="label"  style="color: blueviolet;"><b>+ Add Friend</b></span>
                </v-btn>
                
              </v-col>
              
              <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>Add Friend</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-autocomplete
            v-model="selectedParticipant"
            :items="participants"
            item-title="username"
            item-value="username"
            label="Search Participants"
            @input="searchParticipants"
          ></v-autocomplete>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="addFriend">Add</v-btn>
        <v-btn color="error" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

              <v-col cols="2">
                <v-btn @click="declinedRequests" class="notificationIcon" icon >
                  <v-icon class="icon">mdi-bell-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-toolbar>
          
      </v-card>
      
      <div v-if="declined" class="sub-dashboard" style="margin-bottom: 25px">
        <h2
        style="
          font-weight: bold;
          text-align: left;
          padding: 0px 10px;
          font-size: x-large;
        "
      >
        Declined Friend Requests 
      </h2>
            <table class="table">
            <tbody>
              <tr v-for="friend in friends" :key="friend.username">
               <td>
                  {{ friend.username }} declined your friend request.
               </td>
              </tr>
            </tbody>
          </table>
          </div>
          <ContactList @update-chat-box="updateSelectedChat"/>
        </div>
      </v-col>

      <v-col :cols="showLeftPanel ? 8 : 12">
        <div class="right-panel">
          <ChatBox :selectedChat="selectedChat" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ContactList from './ContactList.vue';
import ChatBox from './ChatBox.vue';
import axios from 'axios';
export default {
  name: "FriendsMain",
  components: {
    ContactList,
    ChatBox
  },
  data: () => ({
    showLeftPanel: true, // Initially show 
    selectedChat: null, // Initialize selectedChat
    dialog: false,
      searchQuery: "",
      selectedParticipant: '',
      participants: [],
      open:0,
      declined:false,
      friends: [],
  }),
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    this.getDeclinedFriends()

  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    flag() {
      this.dialog = 1 - this.dialog
    },
    async getDeclinedFriends(){
      await axios
        .get(`http://localhost:3000/api/friends/getDeclinedRequests/${JSON.parse(localStorage.getItem('user-info')).id}`)
        .then((response) => {
          console.log(response.data);
          this.friends = response.data.result;
        })
        .catch((error) => {
          console.error("Error fetching declined users:", error);
        });
    },
    handleResize() {
      const smBreakpoint = 960; //width for 'sm' in Vuetify
      this.showLeftPanel = window.innerWidth >= smBreakpoint;
    },
    updateSelectedChat(chat) {
      // console.log('Selected chat:', chat.friend_photo);
      this.selectedChat = chat; // Update selectedChat when a contact is clicked
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
    closeDialog() {
      this.dialog = false;
    },
    declinedRequests() {
      this.declined = 1 -this.declined
    },
    async addFriend() {
        // Form is valid, proceed to submit
       
        // Send an HTTP request to your backend to save the group details
        // Example using axios:
        await axios
          .post("http://localhost:3000/api/friends/createfriend", {
            user_id: JSON.parse(localStorage.getItem('user-info')).id,
            friend_username: this.selectedParticipant,
          })
          .then((response) => {
            // Group created successfully
            this.$emit("friendCreated", response.data);
            this.closeDialog();
          })
          .catch((error) => {
            console.error("Error creating group:", error);
          });

          await axios
          .post("http://localhost:3000/api/friends/startConversation", {
            member1_id: JSON.parse(localStorage.getItem('user-info')).id,
            friend_username: this.selectedParticipant,
          })
          .then((response) => {
            // Group created successfully
            this.$emit("friendCreated", response.data);
          })
          .catch((error) => {
            console.error("Error creating group:", error);
          });

          this.selectedParticipant = ''
      }
  },
}
</script>

<style scoped>
.left-panel, .right-panel {
  padding: 16px;
}
.left-panel{
  background-color: transparent;
}
.tool{  
  box-shadow: none;
  border:0px;
  /* background-color: transparent; */
  padding-bottom: 10px;
}
.v-container{
  margin-top: 1rem;
}
.v-text-field{
  margin-left: 0.75rem;
  width:90%;
  box-shadow: none;
}
.v-card{
  background-color: white ;
  box-shadow: none;
}
.addfriend{
  width: 80%;
  margin-left: 0.5rem;
  border-radius: 0.5rem;
  font-family: var(--font-radley);
  text-transform: capitalize; 
  color: blueviolet;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
}
.label{
  text-overflow: clip;
  font-size:medium;
}
.table{
  background-color: white;
  width:100%;
  font-size: 20px;
  text-align: left;
  padding: 10px;
}
.icon {
    color:blueviolet;
    }
    .notificationIcon:active {
    color: #673ab7;
    }

  .sub-dashboard {
  border-radius: 15px;
  margin: 10px;
  padding: 11px;
  background: white;
  /* box-shadow: 0 0 50px 15px #48abe0; */
   box-shadow: 0 5px 10px rgba(0, 191, 235, 0.5); 
}
</style>
