import PROYECT_CONFIG from '../../config/config';

class ApiHanler {
    setUserToken(value) {
        this._token = value;
        return this;
    }

    constructor(token){
        this._token = token;
    }

    // eslint-disable-next-line class-methods-use-this
    #__base(path, _method, data, errorCallback) {
        const _header = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if (this._token) {
            _header.Authorization = `Bearer ${ this._token}`;
        }

        return fetch(PROYECT_CONFIG.API_CONFIG.baseURL+path, {
              method: _method,
              headers: _header,
              body: data && JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response)
                    throw new Error(response.statusText);
                }

                return response.json();
            })
            .catch(error => {
                errorCallback(error.message)
            })
    }
              
    __get(path, errorCallback) {
        return this.#__base(path, 'GET', null, errorCallback)
    }
  
    __post(path, data, errorCallback) {
        return this.#__base(path, 'POST', data, errorCallback)
    }
  
    __delete(path, data, errorCallback) {
        return this.#__base(path, 'DELETE', data, errorCallback)
    }
  
    __update(path, data, errorCallback) {
        return this.#__base(path, 'PUT', data, errorCallback)
    }
}

export default ApiHanler  

