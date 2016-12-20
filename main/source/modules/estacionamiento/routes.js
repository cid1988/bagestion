exports = module.exports = {
    '/estacionamiento': {
        title: 'Estacionamiento',
        name: 'estacionamiento',
        allowed: ['estacionamiento'],
        reloadOnSearch: false,
        section: 'estacionamiento',
        views: {
            'body@': {
                templateUrl: '/views/estacionamiento/calendario/calendario.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/estacionamiento/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/estacionamiento/calendario/navbar.html'
                }
        }
    },
    '/estacionamiento/:_id/print': {
        title: 'Reservas',
        name: 'reservas',
        allowed: ['estacionamiento'],
        section: 'estacionamiento',
        views: {
            'body@': {
                templateUrl: '/views/estacionamiento/calendario/print.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/estacionamiento/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    }
};