<template>
  <div class="home">
    <!--Start Landing Page Image-->
    <div class="landing">
      <div class="dark"></div>
      <div class="home-wrap">
        <div class="home-inner"></div>
      </div>
    </div>
    <!--End Landing Page Image-->

    <div class="form-style">
      <div class="card">
        <div class="card-body">
          <div class="text-center theme-color mb-2">
            <img src="../assets/habit-logo.png" alt="Brand" />
            <h4>Habits</h4>
          </div>
          <div v-if="!register">
            <form @submit.prevent="submitLogin()">
            <div class="form-group">
              <input
                required
                type="email"
                class="form-control theme-color"
                placeholder="Email"
                v-model="loginForm.email"
              />
            </div>
            <div class="form-group">
              <input
                required
                type="password"
                class="form-control"
                placeholder="Password"
                v-model="loginForm.password"
              />
            </div>
            <button class="btn btn-outline-light btn-md w-100">Login</button>
          </form>
          <h6 class="theme-color mt-2">Don't have an account yet?</h6>
          <button v-on:click="register = !register" class="btn btn-outline-light btn-sm mt-1">Register</button>
          </div>      
          <div v-else>
            
            <form @submit.prevent="submitRegister()">
            <div class="form-group">
              <input
                required
                type="email"
                class="form-control theme-color"
                placeholder="Email"
                v-model="registerForm.email"
              />
            </div>
            <div class="form-group">
              <input
                required
                type="password"
                class="form-control"
                placeholder="Password"
                v-model="registerForm.password"
              />
            </div>
            <div class="form-group">
              <input
                required
                type="name"
                class="form-control"
                placeholder="Name"
                v-model="registerForm.name"
              />
            </div>
            <button class="btn btn-outline-light btn-md w-100">Register</button>
          </form>

          <h6 class="theme-color mt-2">Already have an account?</h6>
          <button v-on:click="register = !register" class="btn btn-outline-light btn-sm mt-1">Sign In</button>
          </div>      
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import Vue from 'vue'
import {mapActions} from 'vuex'
export default {
  name: "Home",
  components: {},
  data: () => ({
    register: false,
    loginForm: {
      email: "",
      password: ""
    },
    registerForm: {
      email: "",
      password: "",
      name: ""
    },
  }),
  methods: {
    ...mapActions(['ActionDoLogin','ActionRegister']),
    async submitLogin() {
      try{
        await this.ActionDoLogin(this.loginForm)
       
        await this.$router.push({name: 'Habits'})
      } catch (err){
        alert(err.body.error ? err.body.error : 'Unexpected Error')
      }
    },
    async submitRegister() {
      try{
        await this.ActionRegister(this.registerForm)

        await this.$router.push({name: 'Habits'})
      } catch (err){
        alert(err.body.error ? err.body.error : 'Unexpected Error')
      }
    },
  }
};
</script>

<style scoped>
/*==Landing page==*/
.landing {
  position: relative;
  width: 100%;
  height: 100vh;
  display: table;
}

.home-wrap {
  position: absolute;
  height: 100%;
  widows: 100%;
  top: 0;
  left: 0;
}

.home-inner {
  background-image: url("../assets/women-doing-yoga-3822861.jpg");
  position: fixed;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center center;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  display: table;
  will-change: transform;
  z-index: -2;
}

/*===Form===*/
.theme-color {
  color: #ba1a67;
}

input[type="email"]::placeholder,
input[type="password"]::placeholder,
input[type="name"]::placeholder,
input[type="name"],
input[type="email"],
input[type="password"] {
  color: #ba1a67;
}

input[type="email"],
input[type="name"],
input[type="password"],
textarea {
  outline: none;
  box-shadow: none !important;
  border: 1px solid #ba1a67 !important;
}

button:focus,
a:focus,
a.btn:focus {
  outline: 0 !important;
  -webkit-appearance: none;
  box-shadow: none;
}

button,
a,
a.btn {
  transition: all 0.6s ease;
}

.home .btn-md,
.btn-sm {
  border-color: #ba1a67;
  border-width: small;
  color: #ba1a67;
  background-color: white;
}

.home .btn-md:hover,
.btn-sm:hover {
  color: white;
  background-color: #ba1a67;
}

.card {
  width: 30%;
  border: transparent;
}

.card img {
  height: 60px;
}

.form-style {
  z-index: 1;
  position: absolute;
  top: 30%;
  left: 35%;
  width: 100%;
  max-width: 100%;
}
</style>