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
            RESUME: '/businesses/resume',
            UPDATE: '/business/update/',
            DELETE: '/businesses',
            ALL: '/businesses',
            GENERATE_JSON: '/business/generate_json/',
            ROUTE_JSON: '/business/jsonroute'
        },
        AREA: {
            CREATE: '/area',
            GET: '/area/',
            UPDATE: '/area/update/',
            DELETE: '/areas',
            ALL: '/areas',
        },
        SCREEN: {
            CREATE: '/screen',
            GET: '/screen/',
            UPDATE: '/screen/update/',
            DELETE: '/screens',
            ALL: '/screens',
        },
        IMAGE: {
            CREATE: '/image',
            GET: '/image/',
            UPDATE: '/image/update/',
            DELETE: '/images',
            ALL: '/images',
        },
        PRODUCT: {
            CREATE: '/product',
            GET: '/product/',
            UPDATE: '/product/update/',
            DELETE: '/products',
            ALL: '/products',
        },
        DEVICE: {
            CREATE: '/device',
            GET: '/device/',
            UPDATE: '/device/update/',
            DELETE: '/devices',
            ALL: '/devices',
        },
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        ROLES: {
            ADMIN: 'admin'
        }
    },
}

export default PROYECT_CONFIG;