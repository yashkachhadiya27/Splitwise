<template>
  <v-app class="appbar">
    <AppBar
      :search="search"
      :isMenuHidden="isMenuHidden"
      :username="username"
      :windowWidth="windowWidth"
      :drawer="drawer"
      @toggleDrawer="toggleDrawer()"
      @groupCreated="fetchGroups()"
      @successToast="successToast()"
      @errorToast="errorToast()"
    />
    <NavBar :drawer="drawer" />
    <v-main>
      <v-container>
        <FriendsMain />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import { defineComponent } from "vue";

// import Sidebar from "../components/Sidebar.vue";
// import NavBar from "../components/NavBar.vue";
//  import ChatList from '../components/ChatList.vue'
// import FriendsComp from "../components/Friends.vue"
import NavBar from "./NavBar.vue";
import AppBar from "./AppBar.vue";
import FriendsMain from "../components/FriendsMain.vue";

export default defineComponent({
  name: "Friends",
  components: { NavBar,  AppBar, FriendsMain
  //   // FriendsComp
  // },
  },
  data() {
    return {
      drawer: false,
      search: "",
      username: "",
      userInfo:"",
      participants: [],
      groups: [],
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    isCreateGroupButtonHidden() {
      return this.windowWidth <= 800; // Adjust breakpoint as needed
    },
    isTextVerticalAlign() {
      return this.windowWidth <= 800; // Adjust breakpoint as needed
    },
    isMenuHidden() {
      return this.windowWidth <= 426; // Adjust breakpoint as needed
    },
  },
  created() {
    // Fetch group information from backend API
    this.userInfo = JSON.parse(localStorage.getItem("user-info"));
    this.username = this.userInfo.username;
    this.fetchGroups();
    this.fetchParticipants();



    // Keep nav bar open on mounting for larger screens
    if (this.windowWidth > 960) {
      this.drawer = true;
    }

    // Listen for window resize event
    window.addEventListener("resize", this.handleWindowResize);
  },
  destroyed() {
    // Remove window resize event listener to prevent memory leaks
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
    async fetchGroups() {
      // Fetch groups data from backend API
      // Example:
      await axios
        .get(`http://localhost:3000/api/groups/usersGroups/${this.userInfo.id}`)
        .then((response) => {
          this.groups = response.data.members;
        })
        .catch((error) => {
          console.error("Error fetching groups:", error);
        });

      // // For now, using dummy data
      // this.groups = [
      //   { name: "Group 1", amountOwed: 5000, amountOwedToYou: 7600, totalBalance: 2600 },
      //   { name: "Group 2", amountOwed: 3000, amountOwedToYou: 5400, totalBalance: 2400 },
      //   // Add more groups as needed
      // ];
    },
    fetchParticipants() {
      // Fetch participants data from backend API
      // Example:
      // axios.get('/api/participants')
      //   .then(response => {
      //     this.participants = response.data;
      //   })
      //   .catch(error => {
      //     console.error('Error fetching participants:', error);
      //   });

      // For now, using dummy data
      this.participants = [
        { text: "Participant 1", value: "participant1" },
        { text: "Participant 2", value: "participant2" },
        // Add more participants as needed
      ];
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
      console.log("Drawer state:", this.drawer);
    },

    successToast() {
      toast.success("Group Created Successfully!", {
        autoClose: 2000,
      });
    },

    errorToast() {
      toast.error("Error while Group Creation", {
        autoClose: 2000,
      });
    },
    // createNewGroup() {
    //   // Logic for creating a new group
    //   console.log("Create New Group")
    // },
    // searchItems() {
    //   // Implement search functionality here
    //   console.log("Searching for:", this.search);
    // },
    // handleProfileClick() {
    //   // Here you can define the actions to be performed when the Profile option is clicked
    //   console.log("Profile clicked");
    //   // this.$router.push('/profile');
    // },
    // handleLogoutClick() {
    //   // Here you can define the actions to be performed when the Logout option is clicked
    //   console.log("Logout clicked");
    //   // this.$store.dispatch('logout');
    //   // this.$router.push('/login');
    // },
    handleWindowResize() {
      // Update window width on resize
      this.windowWidth = window.innerWidth;
    },
  },
  
});
</script>
<style module>
/* .friends{
  display: flex;
}
.chatListWrapper {
  width: 70%;
}
 /* Override the default height of v-app-bar */

/* .notificationIcon {
    position: absolute;
    top: 23px;
    left: 1103px;
    width: 50px;
    height: 50px;
  } */
/* .notificationIcon:active  {
    color: aqua!important;;
  }
  
  .dashboard {
    position: absolute;
    top: -59px;
    left: 0px;
    border-radius: 30px;
    background-color: var(--color-whitesmoke);
    width: 1777px;
    height: 920px;
    overflow: hidden;
  }
  .maskGroup {
    width: 100%;
    position: relative;
    height: 830px;
  }
  .icon{
    color: #673ab7;
  } */
</style>
