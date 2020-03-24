<template>
  <div class="habits">
    <b-navbar toggleable="lg" type="white" variant="dark">
      <b-navbar-brand href="#" class="navbar-image ml-2 mb-0 pb-0">
        <div class="font-weight-bold text-white">Habits</div>                
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <button v-on:click="signOut" class="btn btn-outline-light">Sign Out</button>
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
            <b-col md="3" class="mb-4">
              <div class="card">
                <div class="card-body p-0">
                  <div class="text-center text-theme mb-2 profile p-0">
                    <img :src="user.profilePhoto.url" alt="profile photo" />
                    <h4 class="mt-1 font-weight-bold">Welcome {{user.name}}!</h4>
                    <p class="font-weight-bold">{{user.habitsOverallPercentage}}</p>
                  </div>
                </div>
              </div>
            </b-col>

            <b-col md="8">
              <div class="overflow-auto">
                <div class="text-right mb-4">
                  <b-button
                    variant="success"
                    @click="$bvModal.show('modal-create-habit')"
                  >Create Habit</b-button>
                </div>

                <ul class="list-group">
                  <li
                    v-for="(habit, index) in habits"
                    v-bind:key="habit._id"
                    class="list-group-item mb-2 rounded-lg p-0 shadow-sm"
                    v-bind:style="{color: habit.color}"                     
                  >
                  <div v-bind:style="{'border-left': `25px solid ${habit.color}`}">
                    <div class="ml-1 p-1">
                      <b-row>
                        <b-col cols="2">
                          <button class="btn btn-sm btn-danger m-1" @click="deleteHabit(index)"><font-awesome-icon :icon="['fas', 'trash']" /></button>
                          <button class="btn btn-sm btn-primary"><font-awesome-icon :icon="['fas', 'edit']" /></button>
                        </b-col>
                        <b-col cols="7">
                          7 day history
                        </b-col>
                        <b-col cols="3">
                          <h6 class="font-weight-bold text-theme">{{habit.name}}</h6>
                        </b-col>
                      </b-row>                      
                    </div>                    
                    </div>                  
                  </li>
                </ul>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </section>
    
    <!--Start Modals-->

    <b-modal id="modal-create-habit" hide-footer>
      <template v-slot:modal-title>
        <div class="text-theme font-weight-bold">
          Create A New Habit!
          </div>        
      </template>
      <div class="d-block text-center">
        <form @submit.prevent="submitNewHabit()">
            <div class="form-group">
              <input
                required
                type="name"
                class="form-control theme-color"
                placeholder="Habit Name"
                v-model="habitForm.name"
              />
            </div>
           <div class="form-group">
              <input
                type="reminderMessage"
                class="form-control"
                placeholder="Reminder Message"
                v-model="habitForm.reminderMessage"
              />
            </div>
            <div class="form-group">
              <input
                type="color"
                class="form-control"
                placeholder="Color"
                v-model="habitForm.color"
              />
            </div>
            <button class="btn btn-success btn-md w-100">Create</button> 
        </form>
      </div>
      <div class="text-right">
        <b-button class="mt-2" variant="info" @click="$bvModal.hide('modal-create-habit')">Cancel</b-button>                    
      </div>
    </b-modal>

    <!--End Modals-->

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
    ],
    selectedProfileImage: null,
    userForm: {
      name: "",
      password: ""
    },
    habitForm: {
      name: "",
      reminderMessage: "",
      color: "#009688"
    },
    updateHabitForm: {
      name: "",
      reminderMessage: "",
      color: ""
    }    
  }),
  async mounted() {
    try {
      await resource.getAllHabits().then(res => {
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
    ...mapActions(["ActionSignOut"]),
    async signOut() {
      try {
        await this.ActionSignOut();
        await this.$router.push({ name: "Home" });
      } catch (err) {
        console.log(err);
      }
    },
    async submitNewHabit() {
      try {
        await resource.postHabit(this.habitForm).then(res => {
          this.habits.push(res.body.habit);
          this.user.habitsOverallPercentage = res.body.habitsOverallPercentage;
          this.$bvModal.hide('modal-create-habit');
        });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
    },
    async performHabit() {
      try {
        await resource
          .performHabit({ id: this.habits[this.updateHabitInfo.index]._id })
          .then(res => {
            this.habits[this.updateHabitInfo.index] = res.body.habit;
            this.user.habitsOverallPercentage =
              res.body.habitsOverallPercentage;
          });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
    },
    async updateHabit(index) {
      try {
        await resource
          .updateHabit(
            { id: this.habits[index]._id },
            this.updateHabitForm
          )
          .then(res => {
            this.habits[index] = res.body.habit;
          });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
    },
    async deleteHabit(index) {
      try {
        await resource
          .deleteHabit({ id: this.habits[index]._id })
          .then(res => {
            res;
            this.habits.splice(index, 1);
          });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
    },
    onFileSelected(event) {
      this.selectedProfileImage = event.target.files[0];
    },
    async uploadProfilePhoto() {
      try {
        const fd = new FormData();
        fd.append(
          "file",
          this.selectedProfileImage,
          this.selectedProfileImage.name
        );
        await resource.setProfilePhoto(fd).then(res => {
          this.user = res.body.user;
        });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
    },
    async deleteProfilePhoto() {
      try {
        await resource.deleteProfilePhoto().then(res => {
          this.user = res.body.user;
        });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
    },
    async updateUser() {
      try {
        await resource.updateUser(this.userForm).then(res => {
          this.user = res.body.user;
        });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
    },
    async deleteUser() {
      try {
        await resource.deleteUser().then(res => {
          res;
          this.signOut();
        });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
    }
  }
};
</script>


<style>
body {
  background-color: #E9ECEF;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  color: white;
  background-color: #1d1f21;
  text-align: left;
}

/*input[type="color"],*/
input[type="name"],
input[type="reminderMessage"],
input[type="password"],
textarea {
  outline: none;
  box-shadow: none !important;
}
button:focus,
a:focus,
button.btn:focus,
.btn-md:focus,
a.btn:focus {
  outline: 0 !important;
  -webkit-appearance: none;
  box-shadow: none;
}

.profile img {
  height: 150px;
  border-radius: 10px;
}

.text-theme {
  color: #505962;;
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
  background: #343A40;
  border-radius: 10px;
}
</style>