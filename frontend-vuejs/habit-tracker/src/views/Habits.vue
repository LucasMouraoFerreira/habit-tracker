<template>
  <div class="habits">
    <b-navbar toggleable="lg" type="white" variant="white" class="navbar">
      <b-navbar-brand href="#" class="navbar-image theme-color ml-2 mb-0 pb-0">
        Habits
        <img src="../assets/habit-logo.png" class="d-inline-block align-top" alt="logo" />
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <button class="btn btn-outline-light btn-sm">Sign Out</button>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>

    <b-container>
      <b-row class="mt-5">
        <b-col md="4" class="mb-4">
          <div class="card">
            <div class="card-body">
              <div class="text-center theme-color mb-2">
                <h4>Profile</h4>
              </div>
            </div>
          </div>
        </b-col>

        <b-col md="6">
          <div class="overflow-auto">
            <ul class="list-group">
              <li class="list-group-item mb-2 rounded-lg">Habit</li>
              <li class="list-group-item mb-2 rounded-lg">Habit</li>
              <li class="list-group-item mb-2 rounded-lg">Habit</li>
              
            </ul>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <div class="footer pt-2 pl-2">
      <p>&copy; Lucas Ferreira 2020</p>
    </div>
  </div>
</template>

<script>
export default {};
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