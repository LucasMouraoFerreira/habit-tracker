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
            <!--Start User Info Section-->
            <b-col md="3" class="mb-4">
              <div class="card">
                <div class="card-body p-0">
                  <div class="text-center text-theme mb-2 mt-2 profile p-0">
                    <img :src="user.profilePhoto.url" alt="profile photo" />
                    <h5 class="mt-1 font-weight-bold">Welcome {{user.name}}!</h5>
                    <h4 class="font-weight-bold text-success">{{user.habitsOverallPercentage}}%</h4>
                    <br />
                    <b-button variant="primary" @click="$bvModal.show('modal-update-user')">
                      <font-awesome-icon :icon="['fas', 'user-edit']" />
                    </b-button>
                  </div>
                </div>
              </div>
            </b-col>
            <!--End User Info Section-->
            <!--Start Habits Section-->
            <b-col md="9">
              <div class="overflow-auto">
                <div class="text-right mb-4">
                  <b-button
                    variant="success"
                    @click="$bvModal.show('modal-create-habit')"
                  >Create Habit</b-button>
                </div>

                <div v-if="renderHabits">
                  <!--Start Habits Info Section-->
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
                            <b-col cols="1">
                              <button class="btn btn-sm btn-danger m-1" @click="deleteHabit(index)">
                                <font-awesome-icon :icon="['fas', 'trash']" />
                              </button>
                              <button
                                class="btn btn-sm btn-primary"
                                @click="updateCurrenteHabit(index)"
                              >
                                <font-awesome-icon :icon="['fas', 'edit']" />
                              </button>
                            </b-col>
                            <b-col cols="5">
                              <p class="text-theme">{{habit.reminderMessage}}</p>
                              <div class="text-center">                                
                                <button
                                  class="btn btn-sm btn-success m-1"
                                  @click="performHabitToday(index)"
                                >Performed Today</button>
                              </div>
                            </b-col>
                            <b-col cols="3">
                              <button
                                class="btn btn-md btn-primary m-1 inline"
                                @click="isShow[index].x = !isShow[index].x"
                              >
                                <font-awesome-icon :icon="['fas', 'chart-bar']" size="2x" />
                                <h6>History</h6>
                              </button>
                            </b-col>
                            <b-col cols="3">
                              <h6 class="font-weight-bold text-theme">{{habit.name}}</h6>
                              <h5
                                class="font-weight-bold"
                                v-bind:style="{ color: habit.color}"
                              >{{habit.currentPercentage}}%</h5>
                            </b-col>
                          </b-row>
                        </div>
                        <div class="text-center"></div>
                        <transition name="slide">
                          <div class="m-1" v-show="isShow[index].x">
                            <area-chart
                              :data="[[habit.percentageHistory[0].date, habit.percentageHistory[0].percentage], [habit.percentageHistory[1].date, habit.percentageHistory[1].percentage], [habit.percentageHistory[2].date, habit.percentageHistory[2].percentage],
                              [habit.percentageHistory[3].date, habit.percentageHistory[3].percentage], [habit.percentageHistory[4].date, habit.percentageHistory[4].percentage], [habit.percentageHistory[5].date, habit.percentageHistory[5].percentage],
                              [habit.percentageHistory[6].date, habit.percentageHistory[6].percentage], [habit.percentageHistory[7].date, habit.percentageHistory[7].percentage], [habit.percentageHistory[8].date, habit.percentageHistory[8].percentage],
                              [habit.percentageHistory[9].date, habit.percentageHistory[9].percentage], [habit.percentageHistory[10].date, habit.percentageHistory[10].percentage], [habit.percentageHistory[11].date, habit.percentageHistory[11].percentage],
                              [habit.percentageHistory[12].date, habit.percentageHistory[12].percentage], [habit.percentageHistory[13].date, habit.percentageHistory[13].percentage], [habit.percentageHistory[14].date, habit.percentageHistory[14].percentage],
                              [habit.percentageHistory[15].date, habit.percentageHistory[15].percentage], [habit.percentageHistory[16].date, habit.percentageHistory[16].percentage], [habit.percentageHistory[17].date, habit.percentageHistory[17].percentage],
                              [habit.percentageHistory[18].date, habit.percentageHistory[18].percentage], [habit.percentageHistory[19].date, habit.percentageHistory[19].percentage], [habit.percentageHistory[20].date, habit.percentageHistory[20].percentage],
                              [habit.percentageHistory[21].date, habit.percentageHistory[21].percentage], [habit.percentageHistory[22].date, habit.percentageHistory[22].percentage], [habit.percentageHistory[23].date, habit.percentageHistory[23].percentage],
                              [habit.percentageHistory[24].date, habit.percentageHistory[24].percentage], [habit.percentageHistory[25].date, habit.percentageHistory[25].percentage], [habit.percentageHistory[26].date, habit.percentageHistory[26].percentage],
                              [habit.percentageHistory[27].date, habit.percentageHistory[27].percentage], [habit.percentageHistory[28].date, habit.percentageHistory[28].percentage], [habit.percentageHistory[29].date, habit.percentageHistory[29].percentage]]"
                              width="100%"
                              height="150px"
                              :min="0"
                              :max="100"
                              :colors="[habit.color, '#666']"
                            ></area-chart>
                          </div>
                        </transition>
                      </div>
                    </li>
                  </ul>
                  <!--End Habits Info Section-->
                </div>
              </div>
            </b-col>
            <!--End Habits Section-->
          </b-row>
        </b-container>
      </div>
    </section>

    <!--Start Update User Modal-->
    <b-modal id="modal-update-user" hide-footer>
      <template>
        <div class="text-theme font-weight-bold">Update Profile Image</div>
        <br />
        <form @submit.prevent="uploadProfilePhoto()">
          <b-form-file
            class="mb-3"
            v-model="selectedProfileImage"
            :state="Boolean(selectedProfileImage)"
            placeholder="Choose a image or drop it here..."
            drop-placeholder="Drop image here..."
          ></b-form-file>
          <div class="mb-3" v-if="selectedProfileImage">
            <button class="btn btn-success btn-md w-100">Update</button>
          </div>
        </form>
        <div v-if="user.profilePhoto.name !== 'default-user'">
          <button class="btn btn-danger btn-md w-100" @click="deleteProfilePhoto()">Delete</button>
        </div>
      </template>
      <template>
        <div>
          <div class="text-theme font-weight-bold mt-3">Update Password</div>
          <br />
          <form @submit.prevent="updateUser()">
            <div class="form-group">
              <input
                required
                type="password"
                class="form-control"
                placeholder="New Password"
                v-model="userForm.password"
              />
            </div>
            <button class="btn btn-success btn-md w-100">Update</button>
          </form>
        </div>
      </template>
      <div>
        <div class="text-theme font-weight-bold mt-3 mb-3">Delete Account</div>
        <button class="btn btn-danger btn-md w-100" @click="deleteUser()">Delete Account</button>
      </div>

      <div class="text-right">
        <b-button class="mt-2" variant="info" @click="$bvModal.hide('modal-update-user')">Cancel</b-button>
      </div>
    </b-modal>
    <!--End Update User Modal-->

    <!--Start Create Habit Modal-->
    <b-modal id="modal-create-habit" hide-footer>
      <template v-slot:modal-title>
        <div class="text-theme font-weight-bold">Create A New Habit!</div>
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
            <input type="color" class="form-control" placeholder="Color" v-model="habitForm.color" />
          </div>
          <button class="btn btn-success btn-md w-100">Create</button>
        </form>
      </div>
      <div class="text-right">
        <b-button class="mt-2" variant="info" @click="$bvModal.hide('modal-create-habit')">Cancel</b-button>
      </div>
    </b-modal>
    <!--End Create Habit Modal-->

    <!--Start Update Habit Modal-->
    <b-modal id="modal-update-habit" hide-footer>
      <template v-slot:modal-title>
        <div class="text-theme font-weight-bold">Update Habit {{habits[current_index].name}}</div>
      </template>
      <div class="d-block text-center">
        <form @submit.prevent="updateHabit(current_index)">
          <div class="form-group">
            <input
              required
              readonly
              type="name"
              class="form-control theme-color"
              v-model="habits[current_index].name"
            />
          </div>
          <div class="form-group">
            <input
              type="reminderMessage"
              class="form-control"
              placeholder="New Reminder Message"
              v-model="habits[current_index].reminderMessage"
            />
          </div>
          <div class="form-group">
            <input
              type="color"
              class="form-control"
              placeholder="Color"
              v-model="habits[current_index].color"
            />
          </div>
          <button class="btn btn-success btn-md w-100">Update</button>
        </form>
      </div>
      <div class="text-right">
        <b-button class="mt-2" variant="info" @click="$bvModal.hide('modal-update-habit')">Cancel</b-button>
      </div>
    </b-modal>
    <!--End Update Habit Modal-->

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
    isShow: [
      {
        x: false
      }
    ],
    user: {
      profilePhoto: {
        name: "default-user",
        key: "default-user",
        url: "http://localhost:8080/images/default-user.png"
      },
      habitsOverallPercentage: "",
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
      password: ""
    },
    habitForm: {
      name: "",
      reminderMessage: "",
      color: "#009688"
    },
    current_index: 0,
    renderHabits: false
  }),
  async mounted() {
    try {
      await resource.getAllHabits().then(res => {
        this.user = res.body.user;
        this.user.habitsOverallPercentage = this.user.habitsOverallPercentage.toFixed(2);
        if (Array.isArray(res.body.habits) && res.body.habits.length) {
          this.habits = res.body.habits;
          this.renderHabits = true;
          for (var i = 0; i < this.habits.length; i++) {
            this.isShow.push({ x: false });
          }
        }
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
        this.$router.go();
      } catch (err) {
        console.log(err);
      }
    },
    updateCurrenteHabit(index) {
      this.current_index = index;
      this.$bvModal.show("modal-update-habit");
    },
    async submitNewHabit() {
      try {
        await resource.postHabit(this.habitForm).then(res => {
          this.habits.push(res.body.habit);
          this.isShow.push({ x: false });
          this.user.habitsOverallPercentage = res.body.habitsOverallPercentage;
          if (!this.renderHabits) {
            this.habits.shift();
            this.renderHabits = true;
          }
          this.$bvModal.hide("modal-create-habit");
        });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
    },
    async performHabitToday(index) {
      try {
        await resource
          .performHabit({ id: this.habits[index]._id })
          .then(res => {
            this.habits[index] = res.body.habit;
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
          .updateHabit({ id: this.habits[index]._id }, this.habits[index])
          .then(res => {
            console.log(res);
            this.habits[index] = res.body.habit;
            this.$bvModal.hide("modal-update-habit");
          });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
    },
    async deleteHabit(index) {
      try {
        await resource.deleteHabit({ id: this.habits[index]._id }).then(res => {
          this.user.habitsOverallPercentage = res.body.habitsOverallPercentage;
          this.habits.splice(index, 1);
          this.isShow.splice(index, 1);
          if (!this.habits.length) {
            this.renderHabits = false;
            this.$router.go();
          }
        });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
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
          this.$bvModal.hide("modal-update-user");
        });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
    },
    async deleteProfilePhoto() {
      try {
        await resource.deleteProfilePhoto().then(res => {
          this.user = res.body.user;
          this.$bvModal.hide("modal-update-user");
        });
      } catch (err) {
        alert(err.body.error ? err.body.error : "Unexpected Error");
      }
    },
    async updateUser() {
      try {
        await resource.updateUser(this.userForm).then(res => {
          this.user = res.body.user;
          this.$bvModal.hide("modal-update-user");
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
  background-color: #e9ecef;
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
  color: #505962;
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
  background: #343a40;
  border-radius: 10px;
}

.slide-enter-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: ease-in;
  -webkit-transition-timing-function: ease-in;
  -o-transition-timing-function: ease-in;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>