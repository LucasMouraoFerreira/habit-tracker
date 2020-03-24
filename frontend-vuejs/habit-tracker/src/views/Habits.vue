<template>
  <div class="habits">
    <b-navbar toggleable="lg" type="white" variant="white" class="navbar">
      <b-navbar-brand href="#" class="navbar-image theme-color ml-2 mb-0 pb-0">
        Habits
        <img src="../assets/habit-logo.png" class="d-inline-block align-top" alt="logo" />
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <button v-on:click="submitLogin" class="btn btn-outline-light btn-sm">Sign Out</button>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>

    <section v-if="errored">
      <p>Sorry, we couldn't connect to the server. Please, try again later.</p>
    </section>

    <section v-else>
      <div v-if="loading">Loading...</div>

      <div v-else>
        <b-container>
          <b-row class="mt-5">
            <b-col md="4" class="mb-4">
              <div class="card">
                <div class="card-body">
                  <div class="text-center theme-color mb-2 profile">
                    <img :src="user.profilePhoto.url" alt="profile photo">
                    <p>Welcome {{user.name}}!</p>
                    <p>{{user.habitsOverallPercentage}}</p>
                  </div>
                </div>
              </div>
            </b-col>

            <b-col md="6">
              <div class="overflow-auto">
                <ul class="list-group">
                  <li
                    v-for="habit in habits"
                    v-bind:key="habit._id"
                    class="list-group-item mb-2 rounded-lg"
                  >{{habit.name}}</li>
                </ul>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </section>

    <div class="footer pt-2 pl-2">
      <p>&copy; Lucas Ferreira 2020</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import Vue from 'vue'
import { mapActions } from "vuex";
import resource from "../http";
export default {
  name: "Habits",
  components: {},
  data: () => ({
    loading: true,
    errored: false,
    user: {
      profilePhoto: {
        name: "default-user",
        key: "default-user",
        url: "http://localhost:8080/images/default-user.png"
      },
      habitsOverallPercentage: 0,
      _id: "",
      email: "",
      name: "",
      __v: 0
    },
    habits: [
      {
        reminderMessage: "Time to practice your habit!",
        currentPercentage: 0,
        color: "#009688",
        maxConsecutiveDaysPerforming: 0,
        consecutiveDaysPerforming: 0,
        consecutiveDaysNotPerforming: 0,
        _id: "",
        name: "",
        percentageHistory: [
          {
            percentage: 0,
            performed: false,
            _id: "",
            date: ""
          }
        ],
        user: "",
        __v: 0
      }
    ]
  }),
  async mounted() {
    try {
      await resource.getAllHabits().then(res => {
        console.log(res.body);
        this.user = res.body.user;
        this.habits = res.body.habits;
      });
    } catch (err) {
      alert(err.body.error ? err.body.error : "Unexpected Error");
      this.errored = true;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions(["ActionSignOut", "ActionLoadSession"]),
    async submitLogin() {
      try {
        await this.ActionSignOut();
        await this.$router.push({ name: "Home" });
      } catch (err) {
        console.log(err);
      }
    }    
  }
};
</script>


<style>
body {
  background-color: #fffafc;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #3b021d;
  color: white;
  text-align: left;
}

.theme-color {
  color: #ba1a67 !important;
}
.navbar {
  border-bottom: 1px solid #ba1a67 !important;
}

.navbar-image img {
  height: 30px;
}

.btn-sm {
  border-color: #ba1a67;
  border-width: small;
  color: #ba1a67;
  background-color: white;
}

.btn-sm:hover {
  color: white;
  background-color: #ba1a67;
}

.profile img {
  height: 150px;
  border-radius: 10px;
}
.card,
.list-group-item {
  border: 1px solid #ffdeeb !important;
}

.list-group {
  max-height: 400px;
  overflow: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  direction: rtl;
}

.list-group::-webkit-scrollbar {
  width: 6px;
}

/* Track */
.list-group::-webkit-scrollbar-track {
  background: transperent;
}

/* Handle */
.list-group::-webkit-scrollbar-thumb {
  background: #ba1a67;
  border-radius: 10px;
}
</style>