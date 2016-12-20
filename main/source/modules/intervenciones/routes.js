exports = module.exports = {
    '/intervenciones': {
        section: 'intervenciones',
        title: 'Intervenciones',
        reloadOnSearch: false,
        allowed: ['intervenciones'],
        views: {
            'body@': {
                templateUrl: '/views/intervenciones/index.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/intervenciones/navbar.html'
            }
        }
    },
    '/intervenciones/nueva': {
        section: 'intervenciones',
        title: 'Nuevo',
        reloadOnSearch: false,
        parents: ['/intervenciones'],
        allowed: ['intervenciones'],
        views: {
            'body@': {
                templateUrl: '/views/intervenciones/nueva.html',
                controller: 'NuevaIntervencionCtrl'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/intervenciones/navbar.html'
            }
        }
    },
    '/intervenciones/:_id/modifica': {
        section: 'intervenciones',
        title: 'Modifica',
        reloadOnSearch: false,
        parents: ['/intervenciones'],
        allowed: ['intervenciones'],
        views: {
            'body@': {
                templateUrl: '/views/intervenciones/nueva.html',
                controller: 'NuevaIntervencionCtrl'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/intervenciones/navbar.html'
            }
        }
    },
    '/intervenciones/:_id': {
        section: 'intervenciones',
        title: 'Detalle',
        reloadOnSearch: false,
        parents: ['/intervenciones'],
        allowed: ['intervenciones'],
        views: {
            'body@': {
                templateUrl: '/views/intervenciones/detalle.html',
                controller: 'VerIntervencionCtrl'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/intervenciones/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/intervenciones/navbarRight.html'
            }
        }
    }
};