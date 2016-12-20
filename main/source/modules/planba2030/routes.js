exports = module.exports = {
    '/planba2030/reporte': {
        title: 'Reporte Plan BA 2030',
        section: 'planba2030',
        allowed: ['planba2030'],
        views: {
            'body@': {
                templateUrl: '/views/planba2030/reporteHoracio.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/planba2030/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/planba2030/nuevo': {
        title: 'Nuevo Plan BA 2030',
        section: 'planba2030',
        allowed: ['planba2030'],
        views: {
            'body@': {
                templateUrl: '/views/planba2030/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/planba2030/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/planba2030/:_id': {
        title: 'Detalle Plan BA 2030',
        section: 'planba2030',
        allowed: ['planba2030'],
        views: {
            'body@': {
                templateUrl: '/views/planba2030/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/planba2030/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/planba2030': {
        title: 'Plan BA 2030',
        section: 'planba2030',
        allowed: ['planba2030'],
        views: {
            'body@': {
                templateUrl: '/views/planba2030/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/planba2030/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/planba2030/navbar-right.html'
            }
        },
        reloadOnSearch: false,
    }
};