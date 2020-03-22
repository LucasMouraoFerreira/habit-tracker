import Vue from 'vue'
import VueResource from 'vue-resource'
import services from './services'
import interceptors from './interceptors'

Vue.use(VueResource)

const http = Vue.http

const resource = Vue.resource('', {}, services)

http.interceptors.push(interceptors);

const setBearerToken = token => {
    http.headers.common['Authorization'] = `Bearer ${token}`
}

export default resource
export { http , setBearerToken }
