import axios from 'axios';
import PROJECT_CONFIG from '../../config/config';

class ApiHanler {
    setUserToken(value) {
        this._token = value;
        return this;
    }

    setUserRefreshToken(value) {
        this._refreshToken = value;
        return this;
    }

    constructor(token, refreshToken){
        this._token = token;
        this._refreshToken = refreshToken;
        this._saveParamsAfterRefreshToken = {};
    }

    // eslint-disable-next-line class-methods-use-this
    #__getPath(path) {
        return PROJECT_CONFIG.API_CONFIG.baseURL+path
    }

    // eslint-disable-next-line class-methods-use-this
    #__then(promise, errorCallback, onLoadingCallBack) {
        onLoadingCallBack(true)
        return promise.then(response => {
                onLoadingCallBack(false)
                if (response.status === 401){
                    errorCallback(response.statusText)
                } else if(response.status === 500){
                    errorCallback(response.statusText)
                } else if(response.status === 300){
                    response.data().then((value) => {
                        errorCallback(value.statusText)
                    })
                }

                return response.data;
            })
            .catch(error => {
                if (error.status === 401){
                    errorCallback(error.response.statusText)
                } else if(error.status === 500){
                    errorCallback(error.response.statusText)
                } else if(error.status === 300){
                    error.response.data().then((value) => {
                        errorCallback(value.statusText)
                    })
                } else {
                    errorCallback(error.message)
                }
                onLoadingCallBack(false)
                console.log(error)
            })
    }

    #__getHeaders(data) {
        let _header = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        if (data instanceof FormData) {
            _header = {
                "Accept": "application/json"
            }
        }

        if (this._token) {
            _header.Authorization = `Bearer ${ this._token }`;
        }

        return _header
    }
              
    __get(path, errorCallback, onLoadingCallback = () => {}) {
        const result = axios.get(this.#__getPath(path), {
            headers: this.#__getHeaders(null)
        });
        return this.#__then(result, errorCallback, onLoadingCallback)
    }
  
    __post(path, data, errorCallback, onLoadingCallback = () => {}, onUploadProgress = () => {}) {
        const result = axios.post(this.#__getPath(path), data, {
            headers: this.#__getHeaders(data),
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onUploadProgress(percentCompleted);
            },
        });

        return this.#__then(result, errorCallback, onLoadingCallback)
    }
  
    __delete(path, _data, errorCallback, onLoadingCallback = () => {}) {
        const result = axios.delete(this.#__getPath(path), {
            data: _data,
            headers: this.#__getHeaders(_data)
        });

        return this.#__then(result, errorCallback, onLoadingCallback)
    }
  
    __update(path, data, errorCallback, onLoadingCallback = () => {}) {
        const result = axios.put(this.#__getPath(path), data, {
            headers: this.#__getHeaders(data)
        });

        return this.#__then(result, errorCallback, onLoadingCallback)
    }
}

export default ApiHanler  

