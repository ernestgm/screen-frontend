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

    mRefreshToken = (successCallback, errorCallback) => {
        const formData = {
            'refresh_token': this._refreshToken
        }
        this.__post(`/refresh-token`, formData, errorCallback, null)
            .then(response => {
                successCallback(response.token)
            })
            .catch(error => {
                console.log(error)
                errorCallback(error.message)
            })
    }

    // eslint-disable-next-line class-methods-use-this
    #__base(path, _method, data, errorCallback, refreshCallBack, onLoadingCallBack) {
        let _header = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        let postData = data && JSON.stringify(data)
        if (data instanceof FormData) {
            postData = data
            _header = {
                "Accept": "application/json"
            }
        }

        if (this._token) {
            _header.Authorization = `Bearer ${ this._token }`;
        }

        onLoadingCallBack(true)
        return fetch(PROJECT_CONFIG.API_CONFIG.baseURL+path, {
              method: _method,
              headers: _header,
              body: postData
            })
            .then(response => {
                onLoadingCallBack(false)
                if (response.status === 401 && this._refreshToken) {
                    this._saveParamsAfterRefreshToken.path = path
                    this._saveParamsAfterRefreshToken.method = _method
                    this._saveParamsAfterRefreshToken.data = data

                    this.mRefreshToken((newToken) => {
                        if (newToken) {
                            this.setUserToken(newToken)
                            const currentUser = JSON.parse(localStorage.getItem('current-user'))
                            currentUser.state.currentUser.token = newToken
                            localStorage.removeItem('current-user');
                            localStorage.setItem('current-user', JSON.stringify(currentUser));
                            refreshCallBack()
                        }
                    }, errorCallback )
                } else if (response.status === 401){
                    errorCallback(response.statusText)
                    throw new Error(response.statusText);
                } else if(response.status === 500){
                    errorCallback(response.statusText)
                    throw new Error(response.statusText);
                }

                return response.json();
            })
            .catch(error => {
                onLoadingCallBack(false)
                console.log(error)
                errorCallback(error.message)
            })
    }
              
    __get(path, errorCallback, refreshCallback, onLoadingCallback = () => {}) {
        return this.#__base(path, 'GET', null, errorCallback, refreshCallback, onLoadingCallback)
    }
  
    __post(path, data, errorCallback, refreshCallback, onLoadingCallback = () => {}) {
        return this.#__base(path, 'POST', data, errorCallback, refreshCallback, onLoadingCallback)
    }
  
    __delete(path, data, errorCallback, refreshCallback, onLoadingCallback = () => {}) {
        return this.#__base(path, 'DELETE', data, errorCallback, refreshCallback, onLoadingCallback)
    }
  
    __update(path, data, errorCallback, refreshCallback, onLoadingCallback = () => {}) {
        return this.#__base(path, 'PUT', data, errorCallback, refreshCallback, onLoadingCallback)
    }
}

export default ApiHanler  

