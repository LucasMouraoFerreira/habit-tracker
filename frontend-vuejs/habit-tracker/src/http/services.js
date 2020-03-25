const baseURL = 'http://localhost:8080/'

export default {
    login: { method: 'post', url: `${baseURL}auth/authenticate`},
    register: { method: 'post', url: `${baseURL}auth/register`},
    getAllHabits: {method: 'get', url: `${baseURL}habits`},
    postHabit: {method: 'post', url: `${baseURL}habits`},
    updateHabit: {method: 'put', url: `${baseURL}habits{/id}`},
    deleteHabit: {method: 'delete', url: `${baseURL}habits{/id}`},
    performHabit: {method: 'post', url: `${baseURL}habits/habitperformed`},
    setProfilePhoto: {method: 'put', url: `${baseURL}users/profilephoto`},
    deleteProfilePhoto: {method: 'delete', url: `${baseURL}users/profilephoto`},
    updateUser: {method: 'put', url: `${baseURL}users`},
    deleteUser: {method: 'delete', url: `${baseURL}users`}

}