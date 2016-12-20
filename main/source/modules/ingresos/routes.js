exports = module.exports = {
    '/ingresos/nuevo': {
        title: 'Nuevo ingreso',
        section: 'ingresos',
        allowed: ['ingresos.editar'],
        views: {
            'body@': {
                templateUrl: '/views/ingresos/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/ingresos/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/ingresos/visitantes': {
        title: 'Visitantes',
        section: 'visitantes',
        allowed: ['ingresos'],
        views: {
            'body@': {
                templateUrl: '/views/visitantes/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/ingresos/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/ingresos/:_id': {
        title: 'Detalle de ingreso',
        section: 'ingresos',
        allowed: ['ingresos'],
        views: {
            'body@': {
                templateUrl: '/views/ingresos/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/ingresos/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/ingresos': {
        title: 'Ingresos',
        section: 'ingresos',
        allowed: ['ingresos'],
        views: {
            'body@': {
                templateUrl: '/views/ingresos/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/ingresos/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};