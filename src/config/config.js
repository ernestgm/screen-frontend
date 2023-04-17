const API_CONFIG = {
    baseURL: process.env.REACT_APP_API_CONFIG || 'http://www.screen-server.test/api/v1',
    LOGIN: {
        path: '/login'
    }
}

export default API_CONFIG;