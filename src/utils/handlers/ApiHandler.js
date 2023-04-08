import useAuthStore from "../../zustand/useAuthStore";
import API_CONFIG from '../../config/config';

class ApiHanler {
    constructor(currentUser){
        this.currentUser = currentUser;
    }

    // eslint-disable-next-line class-methods-use-this
    #__base(path, _method, data) {
        const _header = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if (this.currentUser) {
            _header.Authorization = `Bearer ${ this.currentUser}`;
        }
        return fetch(API_CONFIG.baseURL+path, {
              method: _method,
              headers: _header,
              body: JSON.stringify(data)
            })
            // .then(res => {
            // // Unfortunately, fetch doesn't send (404 error) into the cache itself
            // // You have to send it, as I have done below
            //     if(res.status >= 403) {
            //         console.log(res)
            //     }
            // })
    }
              
    __get(path) {
        return this.#__base(path, 'GET')
    }
  
    __post(path, data) {
        return this.#__base(path, 'POST', data)
    }
  
    __delete(path) {
        return this.#__base(path, 'DELETE')
    }
  
    __update(path, data) {
        return this.#__base(path, 'UPDATE')
    }
}

export default ApiHanler  

