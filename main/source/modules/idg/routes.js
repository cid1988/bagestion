exports = module.exports = {
    '/idg/nuevo': {
        title: 'IDG - Nuevo',
        section: 'idg',
        allowed: ['idg'],
        views: {
            'body@': {
                templateUrl: '/views/idg/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/idg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/idg/:_id': {
        title: 'IDG - Detalle',
        section: 'idg',
        allowed: ['idg'],
        views: {
            'body@': {
                templateUrl: '/views/idg/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/idg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/idg': {
        title: 'IDG',
        section: 'idg',
        allowed: ['idg'],
        views: {
            'body@': {
                templateUrl: '/views/idg/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/idg/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/idg/navbarRight.html'
            }
        },
        reloadOnSearch: false,
    },
    '/idg/imprimir/:_id': {
        title: 'IDG - Imprimir',
        section: 'idg',
        allowed: ['idg'],
        views: {
            'body@': {
                templateUrl: '/views/idg/imprimir.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/idg/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};