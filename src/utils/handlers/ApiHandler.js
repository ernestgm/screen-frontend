import useAuthStore from "../../zustand/useAuthStore";
import API_CONFIG from '../../config/config';

class ApiHanler {
    constructor(currentUser){
        this.currentUser = currentUser;
    }

    __base(path, method, data) {
        console.log(API_CONFIG.baseURL)
        return fetch(API_CONFIG.baseURL+path, {
              method: method,
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
    }
              
    __get(path) {
        return this.__base(path, 'GET')
    }
  
    __post(path, data) {
        return this.__base(path, 'POST')
    }
  
    __delete(path) {
        return this.__base(path, 'DELETE')
    }
  
    __update(path, data) {
        return this.__base(path, 'UPDATE')
    }
}

export default ApiHanler  

