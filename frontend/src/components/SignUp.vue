<template>
  <div class="sign-up-container">
    <div class="sign-up-form">
      <div class="form-and-image">
        <div class="purple-section">
          <img src="../assets/loginImage.jpg" alt="Login Image" />
        </div>
        <div class="white-section">
          <div class="title-container">
            <h2>Welcome</h2>
          </div>
          <form
            @submit.prevent="submitForm"
            class="form-elements"
            ref="signupForm"
            enctype="multipart/form-data"
          >
            <input
              type="text"
              required
              v-model="name"
              placeholder="Enter Name"
            />
            <input
              type="email"
              required
              v-model="email"
              placeholder="Enter Email"
            />
            <input
              type="tel"
              required
              v-model="number"
              placeholder="Enter Phone Number"
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number without any alphabets."
            />
            <input
              type="password"
              required
              v-model="password"
              placeholder="Enter Password"
            />
            <input
              type="file"
              placeholder="Enter file"
              v-on:change="handleProfileImg"
            />
            <button @click.prevent="generateOTP" v-if="!otpInput">
              Generate OTP
            </button>
            <input
              v-if="otpInput"
              type="text"
              v-model="enteredOtp"
              placeholder="Enter OTP"
            />
            <!-- Error message -->
            <p v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </p>
            <!-- Success message -->
            <p v-if="successMessage" class="success-message">
              {{ successMessage }}
            </p>
            <button v-if="otpInput" type="submit">Register</button>

            <p>
              Already have an account?
              <router-link to="/login">Login Here.</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignUp',
  data() {
    return {
      name: '',
      email: '',
      number: '',
      password: '',
      otpInput: false,
      otp: null,
      enteredOtp: '',
      errorMessage: '',
      successMessage: '',
      profileImg: null,
    };
  },
  methods: {
    handleProfileImg(e) {
      this.profileImg = e.target.files[0];
      console.log(this.profileImg);
    },

    async generateOTP() {
      try {
        const randomOTP = Math.floor(100000 + Math.random() * 900000);
        console.log('Generated OTP:', randomOTP);
        this.otpInput = true; // Show OTP input field
        this.otp = randomOTP; // Store generated OTP in component state for validation later on
      } catch (error) {
        this.handleError('Failed to generate OTP. Please try again later.');
      }
    },

    async submitForm() {
      try {
        // Validate form fields
        const isFormValid = await this.validateForm();
        if (!isFormValid) return;

        // Validate OTP
        const isOTPValid = await this.validateOTP();
        if (!isOTPValid) return;

        // Perform registration
        const result = await this.registerUser();

        if (result.status === 200 || result.status === 201) {
          // Clear messages and reset form
          this.clearMessages();
          this.successMessage = 'Registration successful!';
          this.$refs.signupForm.reset();

          // Attempt to log in with the registered credentials
          const loginResult = await this.loginUser();

          if (loginResult.status === 200 || loginResult.status === 201) {
            // Store user information in localStorage
            localStorage.setItem(
              'user-info',
              JSON.stringify(loginResult.data.userData)
            );

            // Redirect to Dashboard page
            this.$router.push({ path: '/' });
          } else {
            this.handleError(`Login failed: ${loginResult.data.message}`);
          }
        } else {
          this.handleError(`Registration failed: ${result.data.message}`);
        }
      } catch (error) {
        this.handleError(`Error during registration: ${error.message}`);
      }
    },

    async validateForm() {
      // Validate form fields
      if (!this.name || !this.email || !this.number || !this.password) {
        this.handleError('All fields are required.');
        return false;
      }

      const phoneNumberPattern = /^\d{10}$/;
      if (!phoneNumberPattern.test(this.number)) {
        this.handleError(
          'Please enter a valid 10-digit phone number without any alphabets.'
        );
        return false;
      }

      return true;
    },

    async validateOTP() {
      // Validate OTP
      if (!this.enteredOtp) {
        this.handleError('Please enter OTP.');
        return false;
      }

      if (this.enteredOtp != this.otp) {
        this.handleError("The entered OTP doesn't match.");
        return false;
      }

      return true;
    },

    async registerUser() {
      const formData = new FormData();
      formData.append('name', this.name);
      formData.append('email', this.email);
      formData.append('password', this.password);
      formData.append('username', this.email);
      formData.append('UserImage', this.profileImg, this.profileImg.name);

      return await axios.post(
        'http://localhost:3000/api/user/register',
        formData
      );
    },

    async loginUser() {
      const loginData = {
        email: this.email,
        password: this.password,
      };

      return await axios.post('http://localhost:3000/api/user/login', loginData);
    },

    handleError(errorMessage) {
      // Handle error messages
      this.errorMessage = errorMessage;
    },

    clearMessages() {
      // Clear error and success messages
      this.errorMessage = '';
      this.successMessage = '';
    },
  },
  mounted() {
    // Check if the user is already logged in
    const userInfo = localStorage.getItem('user-info');
    if (userInfo) {
      // If the user is logged in, redirect to the Dashboard page
      this.$router.push({ name: 'Dashboard' });
    }
  },
};
</script>

<style scoped>
.sign-up-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #8231e6, #5c1cda);
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-weight: 500;
  font-style: normal;
}

.sign-up-form {
  border-radius: 20px;
  padding: 30px;
  width: 50%;
  /* box-shadow: 0 10px 15px #1b8cefcc; */
}

.form-and-image {
  display: flex;
}

.purple-section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  background-color: #8a55e3;
  border-radius: 20px 0 0 20px;
  box-shadow: 0 10px 15px #1b8cefcc;
  margin-left: -30px;
  margin-top: -30px;
  margin-bottom: -30px;
}

.purple-section img {
  width: 60%;
  height: 65%;
}

.white-section {
  width: 40%;
  background-color: #fff;
  border-radius: 0 20px 20px 0;
  padding: 20px;
  box-shadow: 0 10px 15px #1b8cefcc;
  margin-right: -30px;
  margin-top: -30px;
  margin-bottom: -30px;
}

.form-elements {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
}

.form-elements input,
.form-elements button {
  margin-bottom: 20px;
  padding: 10px;
  border: none;
  outline: none;
  border-bottom: 1px solid #817edd;
  border-radius: 5px;
}

.form-elements input[type='text'],
.form-elements input[type='email'],
.form-elements input[type='tel'],
.form-elements input[type='password'] {
  background-color: #fff;
  width: 90%;
}

.form-elements input::placeholder {
  color: #5146ae;
}

.form-elements button {
  background: linear-gradient(to right, #5c1cda, #a15af6);
  color: #fff;
  cursor: pointer;
  width: 50%;
}

.form-elements button:hover {
  background-color: #69327e;
}

.form-elements a {
  color: #2359c5d0;
  text-decoration: none;
}

.title-container {
  margin-left: -20px;
  margin-top: -20px;
  background-color: #8a55e3;
  border-radius: 0 20px 20px 0;
  width: 60%;
}

.title-container h2 {
  margin-bottom: 20px;
  color: #fff;
}

.error-message {
  color: red;
}

.success-message {
  color: green;
}
</style>