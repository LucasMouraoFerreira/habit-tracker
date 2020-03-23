const baseURL = 'http://localhost:8080/'

export default {
    loadsession: { method: 'get', url: `${baseURL}users/loadsession`},
    login: { method: 'post', url: `${baseURL}auth/authenticate`},
    register: { method: 'post', url: `${baseURL}auth/register`},      
}