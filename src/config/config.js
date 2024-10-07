const PROJECT_CONFIG = {
    NAME: 'PlayAds',
    API_CONFIG: {
        baseURL: process.env.REACT_APP_API_CONFIG_BASE_URL,
        USERS: {
            CREATE: '/user',
            UPDATE: '/user/update/',
            ALL: '/users',
            LOGIN: '/login',
            LOGOUT: '/logout',
            ACTIVATE: '/activate-device'
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
        MARQUEE: {
            CREATE: '/marquee',
            GET: '/marquee/',
            UPDATE: '/marquee/update/',
            DELETE: '/marquees',
            ALL: '/marquees',
        },
        LOGS: {
            VIEW: '/getcontentlogfiles',
            ALL: '/getlogfiles',
        },
        AD: {
            CREATE: '/ad',
            GET: '/ad/',
            UPDATE: '/ad/update/',
            DELETE: '/ads',
            ALL: '/ads',
        },
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        ROLES: {
            ADMIN: 'admin'
        }
    },
    WS_CONFIG: {
        BASE_URL: process.env.REACT_APP_CENTRIFUGUE_BASE_URL,
        WS_SECRET: process.env.WS_SECRET,
    },
    TABLE_CONFIG: {
        ROW_PER_PAGE: 25,
        ROWS_PER_PAGE_OPTIONS: [25, 50, 100]
    }
}

export default PROJECT_CONFIG;