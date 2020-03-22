import Vue from 'vue'
import VueResource from 'vue-resource'
import services from './services'

Vue.use(VueResource)

const http = Vue.http

//http.options.root = 'http://localhost:8080/'

/*Object.keys(services).map(service => {
    services[service] = Vue.resource('', {}, services[service])
})*/

const resource = Vue.resource('', {}, services);


export { http }
export default resource