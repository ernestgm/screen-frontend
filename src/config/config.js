const PROYECT_CONFIG = {
    NAME: 'EScreen',
    API_CONFIG: {
        baseURL: process.env.REACT_APP_API_CONFIG_BASE_URL,
        USERS: {
            CREATE: '/user',
            UPDATE: '/user/update/',
            ALL: '/users',
            LOGIN: '/login',
            LOGOUT: '/logout',
        },
        BUSINESS: {
            CREATE: '/business',
            GET: '/business/',
            UPDATE: '/business/update/',
            DELETE: '/businesses',
            ALL: '/businesses',
        },
    },
    GOOGLE_API_KEY: 'AIzaSyCUcpKY6fcESOmIpZfYlNRZNLS1dA0is-g'
}

export default PROYECT_CONFIG;