<template>
  <!-- <div class="chatList" v-if="selectedChat" style="border-radius: 15px;">
    top bar in personal chat -->

  <section
    class="gradient-custom"
    v-if="selectedChat"
    style="border-radius: 15px; box-shadow: 0 5px 10px rgba(0, 191, 235, 0.5)"
  >
    <div class="WalletParent">
      <img
        style="margin: 10px 10px 0px 10px"
        class="NeedAWallet"
        loading="lazy"
        alt=""
        :src="selectedChat.friend_photo"
      />

      <span style="margin-top: 15px; font-size: larger">{{
        selectedChat.friend_name
      }}</span>
    </div>
    <hr />
    <div class="container py-5">
      <div class="row">
        <div class="col-md-12 col-lg-12 col-xl-12">
          <ul
            class="list-unstyled text-white" ref="messagesContainer"
            style="height: 49vh; overflow-y: auto; padding: 10px"
          >
            <div v-for="message in messages" :key="message.m_id">
              <li class="d-flex justify-content-start mb-4 " v-if="message.s_id != user_id" >
              <img
                :src="selectedChat.friend_photo"
                alt="avatar"
                class="rounded-circle d-inline-flex align-self-end me-3 shadow-1-strong"
                width="60"
              />
              <div
                class="card"
                style="
                  background: rgba(24, 24, 16, 0.2);
                  border-radius: 2em;
                  backdrop-filter: blur(15px);
                  border: 2px solid rgba(255, 255, 255, 0.05);
                  background-clip: padding-box;
                  box-shadow: 10px 10px 10px rgba(46, 54, 68, 0.03);
                "
              >
                <div
                  class="card-header d-flex justify-content-start p-3"
                  style="
                    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                    background: transparent;
                  "
                >
                  <p class="fw-bold mb-0">{{selectedChat.friend_name}}</p>
                  <!-- <p class="text-light small mb-0"><i class="far fa-clock"></i> 12 mins ago</p> -->
                </div>
                <div class="card-body">
                  <p class="mb-0">{{message.message}}</p>
                </div>
              </div>
            </li>

            <li v-else class="d-flex justify-content-end mb-4">
              <div
                class="card w"
                style="
                  background: rgba(24, 24, 16, 0.2);
                  border-radius: 2em;
                  backdrop-filter: blur(15px);
                  border: 2px solid rgba(255, 255, 255, 0.05);
                  background-clip: padding-box;
                  box-shadow: 10px 10px 10px rgba(46, 54, 68, 0.03);
                "
              >
                <div
                  class="card-header d-inline-flex justify-content-end p-3"
                  style="
                    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                    background: transparent;
                  "
                >
                  <p class="fw-bold mb-0">You</p>
                  <!-- <p class="text-light small mb-0"><i class="far fa-clock"></i> 13 mins ago</p> -->
                </div>
                <div class="card-body d-inline-flex justify-content-end">
                  <p class=" justify-content-end mb-0">{{message.message}}</p>
                </div>
              </div>
              <img
                :src="user_image"
                alt="avatar"
                class="rounded-circle d-inline-flex align-self-end ms-3 shadow-1-strong"
                width="60"
              />
            </li>
            </div>
            
        
          </ul>
          <ul class="list-unstyled text-white">
            <li class="mb-3">
              <div data-mdb-input-init class="form-outline form-white">
                <textarea
                  class="form-control"
                  id="textAreaExample3"
                  v-model="message"
                  placeholder="Type your message here..."
                  rows="4"
                  style="display: inline-flex; width: 90%"
                ></textarea>
                <button
                  type="button"
                  @click="sendMessage"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  class="btn btn-light btn-lg btn-rounded float-end"
                  style="color: black; margin: 30px 0px"
                >
                  Send
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section
    class="gradient-custom chatbox"
    v-else
    style="border-radius: 15px; box-shadow: 0 5px 10px rgba(0, 191, 235, 0.5)"
  >
    <img src="robot.gif" alt="robot" />
    <h1>
      Welcome, <span>{{ user_name }}!</span>
    </h1>
    <h3>Please select a chat to start messaging</h3>
  </section>

  <!-- </div> -->
</template>
<script>
import { io } from 'socket.io-client';
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  name: "ChatBox",
  data() {
    return {
      user_image: JSON.parse(localStorage.getItem("user-info")).image,
      user_name: JSON.parse(localStorage.getItem("user-info")).name,
      user_id: JSON.parse(localStorage.getItem("user-info")).id, 

      messages: [],
      message: "",
      socket: null,
      error: null,
    };
  },
  props: {
    selectedChat: {
      type: Object,
      required: true,
    },
    currentUserID: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    if(this.selectedChat){
      this.loadMessages()
    }
    console.log('User Conneceui')
    this.socket = io('http://localhost:3000'); 

    this.socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      this.error = 'Failed to connect to server.';
    });

    this.socket.emit("add-user", this.user_id)

    this.socket.on('msg-receive', (msg) => {
      this.messages.push({ message: msg , time: new Date().toLocaleTimeString()}); 
      this.$nextTick(() => {
          this.scrollToBottom();
        });
    });
  },

  watch: {
    selectedChat() {
      this.loadMessages();
      this.scrollToBottom()
    },
  },
  methods: {
    scrollToBottom() {
      const messagesContainer = this.$refs.messagesContainer;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    },
    
    async sendMessage() {
      // Replace this with your logic to handle the message, e.g., sending it to a server
      if (this.message.length > 0) {
        await axios
          .post("http://localhost:3000/api/messages/addmessage", {
            sender_id: JSON.parse(localStorage.getItem("user-info")).id,
            chat_id: this.selectedChat.c_id,
            message: this.message,
          })
          .then((response) => {
            // Group created successfully
            this.$emit("Message Sent", response.data);
            this.closeDialog();
          })
          .catch((error) => {
            console.error("Error sending message:", error);
          });
        
        // Clear the message after sending

        this.socket.emit("send-msg", {
          to: this.selectedChat.id,
          from: this.user_id,
          message: this.message,
        })

        this.messages.push({
          s_id: this.user_id,
          message: this.message,
        });
        this.$nextTick(() => {
          this.scrollToBottom();
        });

        console.log(this.messages)

        this.message = "";

      }

    },
    async loadMessages() {
      await axios
        .get(
          `http://localhost:3000/api/messages/getAllMessages/${this.selectedChat.c_id}`
        )
        .then((response) => {
          // console.log(response.data);
          this.messages = response.data.result;
          console.log("messages:", this.messages);
        })
        .catch((error) => {
          console.error("Error loading Messages:", error);
        });
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        
    },
  },
});
</script>
<style>
.gradient-custom {
  /* fallback for old browsers */
  background: #fccb90;

  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(
    to bottom right,
    rgba(252, 203, 144, 1),
    rgba(213, 126, 235, 1)
  );

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(
    to bottom right,
    rgba(252, 203, 144, 1),
    rgba(213, 126, 235, 1)
  );
}

.mask-custom {
  background: rgba(24, 24, 16, 0.2);
  border-radius: 2em;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.05);
  background-clip: padding-box;
  box-shadow: 10px 10px 10px rgba(46, 54, 68, 0.03);
}

.chatList {
  background-color: aquamarine;
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  border-radius: var(--br-6xl);
  box-shadow: 0px 4px 5px 2px rgba(121, 197, 239, 0.38);
  background-color: var(--color-white);
  box-sizing: border-box;
  /* height:auto; */
  padding: var(--padding-10xl) var(--padding-4xl) var(--padding-11xl)
    var(--padding-15xl);
  height: 635px;
}
/* profile and top  bar */
.chatEntry {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0px 0px 0px var(--padding-7xs);
  box-sizing: border-box;
  max-width: 100%;
  margin: 0%;
  /* background-color: aqua; */
}

.w {
  width: auto !important;
}

.contactDetails {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--gap-xl-5);
  max-width: 100%;
}

::-webkit-scrollbar {
  width: 5px;
  background-color: #080420;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #9186f3;
  border-radius: 10px;
}

.frameParent {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  max-width: 100%;
  gap: var(--gap-xl);
}
.WalletParent {
  width: 447px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  gap: var(--gap-6xl);
  max-width: 100%;
  align-items: center;
}
/* .bithreeDotsVerticalIcon {
    width: 40px;
    height: 40px;
    position: relative;
    z-index: 3;
  } */
.NeedAWallet {
  height: 59px;
  width: 59px;
  position: relative;
  border-radius: 50%;
  object-fit: cover;
  z-index: 3;
  /* border-radius: 50%; 
  width: 40px; 
  height: 40px;  */
}
.anil {
  top: -11px;
  margin: 0;
  width: 230px;
  position: relative;
  font-size: var(--font-size-1xl);
  letter-spacing: 0.05em;
  font-weight: 600;
  font-family: var(--font-roboto);
  color: var(--color-darkslategray);
  text-align: left;
  display: inline-block;
  z-index: 3;
}

.frameWrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0px 0px var(--padding-9xs);
  box-sizing: border-box;
  min-width: 226px;
  max-width: 100%;
}
.moreOptions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0px 0px var(--padding-mid);
}

.chatbox {
  height: 81vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: rgb(8, 8, 8);
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
}
</style>
