const baseURL = 'http://localhost:8080/'

export default {
    login: { method: 'post', url: `${baseURL}auth/authenticate`},
    loadsession: { method: 'get', url: `${baseURL}users/loadsession`}
}