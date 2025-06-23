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
  
  <div class="dashboard">
    <div>
      <H1 style="font-weight: bold; text-align: left; padding: 15px"
        >DashBoard</H1
      >
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
        Total Summary
      </h2>
      <div class="row">
        <div class="col" style="border-right: 2px solid black; color: red">
          <h5 style="color: black">Amount you owe</h5>
          <i
            class="bi bi-currency-rupee"
            style="font-size: 2rem; display: inline"
          ></i>
          <p style="font-size: 2rem; display: inline">{{ amount_received }}</p>
        </div>

        <div class="col" style="border-right: 2px solid black; color: green">
          <h5 style="color: black">Amount you are owed</h5>
          <i
            class="bi bi-currency-rupee"
            style="font-size: 2rem; display: inline"
          ></i>
          <p style="font-size: 2rem; display: inline">{{ amount_given }}</p>
        </div>

        <div
          v-if="amount_given < amount_received"
          class="col"
          style="color: red"
        >
          <h5 style="color: black">Total Balance</h5>
          <i
            class="bi bi-currency-rupee"
            style="font-size: 2rem; display: inline"
          ></i>
          <p style="font-size: 2rem; display: inline">
            {{ amount_received - amount_given }}
          </p>
        </div>
        <div v-else class="col" style="color: green">
          <h5 style="color: black">Total Balance</h5>
          <i
            class="bi bi-currency-rupee"
            style="font-size: 2rem; display: inline"
          ></i>
          <p style="font-size: 2rem; display: inline">
            {{ amount_given - amount_received }}
          </p>
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
        Friends Summary
      </h2>
      <div class="row">
        <div class="col" style="border-right: 2px solid black">
          <h5 style="color: black">Friends you owe</h5>
          <table class="table">
            <tbody>
              <tr v-for="friend in friendsCreditors" :key="friend.name">
                <td style="text-align: left; vertical-align: middle; padding-left:30px">
                  <img :src="friend.imageUrl" alt="Friend Image" class="user-icon" style="border: 3px solid red">
                  <span style="padding: 10px">{{ friend.name }}</span>
                </td>
                <td style="text-align: left; vertical-align: middle;">
                  Rs {{ friend.amount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col" style="border-right: 2px solid black">
          <h5 style="color: black">Friends owe to you</h5>
          <table class="table">
            <tbody>
              <tr v-for="(friend,) in friendsDebtors" :key="friend.name">
                <td style="text-align: left; vertical-align: middle; padding-left:30px">
                  <img :src="friend.imageUrl" alt="Friend Image" class="user-icon" style="border: 3px solid rgb(13, 199, 13)">
                  <span style="padding: 10px">{{ friend.name }}</span>
                </td>
                <td style="text-align: left; vertical-align: middle;">
                  Rs {{ friend.amount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col">
          <h5 style="color: black">Friends with outstanding balance</h5>
          <table class="table">
            <tbody>
              <tr v-for="(friend,) in friends" :key="friend.name">
                <td style="text-align: left; vertical-align: middle; padding-left:30px">
                  <img :src="friend.imageUrl" alt="Friend Image" class="user-icon" style="border: 3px solid red">
                  <span style="padding: 10px">{{ friend.name }}</span>
                </td>
                <td style="text-align: left; vertical-align: middle;">
                  Rs {{ friend.amount }}
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
        Groups Summary
      </h2>
      <div class="row">
        <div class="col" style="border-right: 2px solid black">
          <h5 style="color: black">Groups you owe</h5>
          <table class="table">
            <tbody>
              <tr v-for="(friend,) in friends" :key="friend.name">
                <td style="text-align: left; vertical-align: middle; padding-left:30px">
                  <span><img :src="friend.imageUrl" alt="Friend Image" class="user-icon" style="border: 3px solid red"></span>
                  <span style="padding: 10px">{{ friend.name }}</span>
                </td>
                <td style="text-align: left; vertical-align: middle;  font-size: 15px">
                  Rs {{ friend.amount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col" style="border-right: 2px solid black">
          <h5 style="color: black">Groups owe to you</h5>
          <table class="table">
            <tbody>
              <tr v-for="(friend,) in friends" :key="friend.name">
                <td style="text-align: left; vertical-align: middle; padding-left:30px">
                  <img :src="friend.imageUrl" alt="Friend Image" class="user-icon" style="border: 3px solid rgb(13, 199, 13)">
                  <span style="padding: 10px">{{ friend.name }}</span>
                </td>
                <td style="text-align: left; vertical-align: middle;">
                  Rs {{ friend.amount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col">
          <h5 style="color: black">Groups with outstanding balance</h5>
          <table class="table">
            <tbody>
              <tr v-for="(friend,) in friends" :key="friend.name">
                <td style="text-align: left; vertical-align: middle; padding-left:30px">
                  <span><img :src="friend.imageUrl" alt="Friend Image" class="user-icon" style="border: 3px solid red"></span>
                  <span style="padding: 10px">{{ friend.name }}</span>
                </td>
                <td style="text-align: left; vertical-align: middle;">
                  Rs {{ friend.amount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  </v-main>
  </v-app>
</template>

<script>
import NavBar from "./NavBar.vue";
import AppBar from "./AppBar.vue";

export default {
  name: "DashBoard",
  components: {
    NavBar,
    AppBar,
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
      console.log("Drawer state:", this.drawer);
    },
    handleWindowResize() {
      // Update window width on resize
      this.windowWidth = window.innerWidth;
    },
  },
  beforeCreate() {
    if(!localStorage.getItem('user-info')){
       this.$router.push({ name: 'Login' });
    }
  },
  created() {
    if(!localStorage.getItem('user-info')){
       this.$router.push({ name: 'Login' });
    }
    else{
      this.userInfo = JSON.parse(localStorage.getItem("user-info"));
    this.username = this.userInfo.username;
    if (this.windowWidth > 960) {
      this.drawer = true;
    }
    }

    window.addEventListener("resize", this.handleWindowResize);
  },
  unmounted() {
    // Remove window resize event listener to prevent memory leaks
    window.removeEventListener("resize", this.handleWindowResize);
  },
  data() {
    return {
      drawer: false,
      windowWidth: window.innerWidth,
      amount_given: 7600,
      amount_received: 5000,
      total_amount: 0,
      friends: [
        { id:1, name: "Rajat", amount: "3000", imageUrl: "favicon.ico" },
        { id:2, name: "Rahul", amount: "600",  imageUrl: "logo.png"},
        { id:3, name: "Vikas", amount: "1600", imageUrl: "loginImage.jpg" },
      ],
      friendsCreditors: [
        { id:1, name: "Rajat", amount: "3000", imageUrl: "favicon.ico" },
        { id:2, name: "Rahul", amount: "600",  imageUrl: "logo.png"},
        { id:3, name: "Vikas", amount: "1600", imageUrl: "loginImage.jpg" },
      ],
      friendsDebtors: [
        { id:1, name: "Ritik", amount: "3000", imageUrl: "favicon.ico" },
        { id:2, name: "Ranveer", amount: "600",  imageUrl: "logo.png"},
        { id:3, name: "Ricky", amount: "1600", imageUrl: "loginImage.jpg" },
      ],
    };
  },
};
</script>

<style scoped>
.dashboard {
  border-radius: 15px;
  padding: 10px;
  background: rgb(209, 203, 224);
}
.sub-dashboard {
  border-radius: 15px;
  margin: 10px;
  padding: 11px;
  background: white;
}
.user-icon {
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
}
</style>