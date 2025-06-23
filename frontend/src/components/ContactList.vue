<template>
    <div class="sub-dashboard" style="margin-bottom:25px">
      <h2
        style="
          font-weight: bold;
          text-align: left;
          padding: 0px 10px;
          font-size: x-large;
        "
      >
        Friends 
      </h2>
      <div class="row">
        <div class="col" >
          <table class="table table-hover" >
            <tbody @click="openChat(chat)"
        v-for="chat in chats"
        :key="chat.id">
              <tr v-if="chat.status" style="cursor: pointer;">
                <td style="text-align: left; vertical-align: middle; padding-left:10px">
                  <img :src="chat.friend_photo" alt="Friend Image" class="user-icon" >
                  <span style="padding: 10px">{{ chat.friend_name }}</span>
                </td>
                <td style="text-align: left; vertical-align: middle;">
                   {{ chat.last_message }}
                </td>
                <td v-if="chat.unread_message_count > 0">
                      
                      {{chat.unread_message_count}}
                      
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
      </div>
    </div>

    <div class="sub-dashboard">
      <h2
        style="
          font-weight: bold;
          text-align: left;
          padding: 0px 10px;
          font-size: x-large;
        "
      >
        Friend Requests
      </h2>
      <div class="row">
        <div class="col" >
          <table class="table" >
            <tbody 
        v-for="chat in chats"
        :key="chat.id" >
              <tr v-if="!chat.status" style="cursor: pointer;">
                <td style="text-align: left; vertical-align: middle; padding-left:30px">
                  <img :src="chat.friend_photo" alt="Friend Image" class="user-icon" >
                  <span style="padding: 10px">{{ chat.friend_name }}</span>
                </td>
                <td style="text-align: left; vertical-align: middle;">
                   <div v-if="chat.member1_id!=userId">
                  <v-btn @click="approveFriend(chat.id)">Accept</v-btn>
                  <v-btn style="margin: 5px" @click="declineFriendRequest(chat.id)">Decline</v-btn>
                </div>
                <v-btn v-if="chat.member1_id==userId" @click="deleteFriendRequest(chat.id)">Unsend</v-btn>
                </td>
                
              </tr>
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
      
</template>

<script>
import axios from "axios";
export default {
  name: "ChatList",
  data() {
    return {
      chats: [],
      userId: JSON.parse(localStorage.getItem('user-info')).id,
    };
  },
  methods: {
    openChat(chat) {
      // Here you can emit an event or directly call a method in the parent component
      // to update the profile icon and name in the ChatBox component
      console.log("Selected chat:", chat);
      this.$emit("update-chat-box", chat);
    },
    async getAllConversationsData() {
      await axios
        .get(`http://localhost:3000/api/friends/getMyAllConversations/${JSON.parse(localStorage.getItem('user-info')).id}`)
        .then((response) => {
          console.log(response.data);
          this.chats = response.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    async approveFriend(id) {
      await axios
          .post("http://localhost:3000/api/friends/approveFriend", {
            user_id: JSON.parse(localStorage.getItem('user-info')).id,
            friend_id : id,
          })
          .then((response) => {
            // Friend created successfully
            this.$emit("friendCreated", response.data);
            this.closeDialog();
          })
          .catch((error) => {
            console.error("Error approving friend:", error);
          });
          


      this.getAllConversationsData();
    },
    
    async declineFriendRequest(id) {
      await axios
          .post("http://localhost:3000/api/friends/declineFriendRequest", {
            user_id: JSON.parse(localStorage.getItem('user-info')).id,
            friend_id : id,
          })
          .then((response) => {
            // Friend created successfully
            this.$emit("friendRequestDeclined", response.data);
            this.closeDialog();
          })
          .catch((error) => {
            console.error("Error Declining friend:", error);
          });
          


      this.getAllConversationsData();
    },
    async deleteFriendRequest(id){
      await axios
          .post("http://localhost:3000/api/friends/deleteFriendRequest", {
            user_id: JSON.parse(localStorage.getItem('user-info')).id,
            friend_id : id,
          })
          .then((response) => {
            // Group created successfully
            this.$emit("friendRequestDeleted", response.data);
            this.closeDialog();
          })
          .catch((error) => {
            console.error("Error deleting group:", error);
          });


      this.getAllConversationsData();
    },
    
    
  },
  mounted() {
    this.getAllConversationsData();
  },
};
</script>

<style scoped>
.full-height {
  height: 70vh; 
}
.scrollable-list {
  overflow-y: auto; 
  height: 100%; 
}
.v-list {
  background-color: #ffffff;
  border-radius: 0.24rem;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  height: 100%;
}
.v-container, .v-row, .v-col {
  padding: 0;
  margin: 0;
}
.chatcontent{
  margin-left: 1.25rem;
  max-width: 90%;
  white-space: nowrap;
  overflow: hidden;
}
/* .v-list-item {
  margin-bottom: 8px;
} */
.v-avatar img {
  border-radius: 50%; 
  width: 40px; 
  height: 40px; 
}
/* .v-list-item-action-text {
  margin-right: 10px;
} */
.v-card {
  background-color: #ffffff;
  padding-top: 8px;
  border-bottom: 1px solid #b4abab;
  border-radius: 0px;
  box-shadow: none;
}
.sub-dashboard {
  border-radius: 15px;
  margin: 10px;
  padding: 11px;
  background: white;
  /* box-shadow: 0 0 50px 15px #48abe0; */
   box-shadow: 0 5px 10px rgba(0, 191, 235, 0.5); 
}

.user-icon {
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
}

</style>
