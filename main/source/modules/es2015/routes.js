exports = module.exports = {
    '/es2015/:_id/hitos': {
        title: 'ES2015 - Hitos',
        section: 'es2015',
        allowed: ['es2015'],
        views: {
            'body@': {
                templateUrl: '/views/es2015/hitos.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/es2015/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/es2015/:_id/nuevoHito': {
        title: 'ES2015 - Hitos',
        section: 'es2015',
        allowed: ['es2015'],
        views: {
            'body@': {
                templateUrl: '/views/es2015/nuevoHito.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/es2015/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/es2015': {
        title: 'ES2015',
        section: 'es2015',
        allowed: ['es2015'],
        views: {
            'body@': {
                templateUrl: '/views/es2015/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/es2015/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/es2015/calendario': {
        title: 'ES2015 - Calendario',
        section: 'calendario',
        allowed: ['es2015'],
        views: {
            'body@': {
                templateUrl: '/views/es2015/calendario.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/es2015/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/es2015/estrategicos': {
        title: 'ES2015 - Estratégicos',
        section: 'estrategicos',
        allowed: ['es2015'],
        views: {
            'body@': {
                templateUrl: '/views/es2015/estrategicos.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/es2015/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/es2015/:_id': {
        title: 'ES2015 - Estructura',
        section: 'es2015',
        allowed: ['es2015'],
        views: {
            'body@': {
                templateUrl: '/views/es2015/estructura.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/es2015/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/es2015/hitos/:_id': {
        title: 'ES2015 - Estructura',
        section: 'es2015',
        allowed: ['es2015'],
        views: {
            'body@': {
                templateUrl: '/views/es2015/detalleHito.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/es2015/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};