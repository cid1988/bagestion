exports = module.exports = {
    '/metrobus': {
        section: 'metrobus',
        title: 'Seguimiento Metrobus',
        reloadOnSearch: false,
        allowed: ['metrobus'],
        parents: ['/metrobus'],
        views: {
            'body@': {
                templateUrl: '/views/metrobus/index.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/metrobus/navbar.html'
            }
        }
    },
    '/metrobus/nuevo': {
        section: 'metrobus',
        title: 'Seguimiento Metrobus - Nuevo',
        allowed: ['metrobus'],
        edit: true,
        new: true,
        parents: ['/metrobus'],
        reloadOnSearch: false,
        views: {
            'body@': {
                templateUrl: '/views/metrobus/nuevo.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/metrobus/navbar.html'
            }
        }
    },
    '/metrobus/:_id': {
        reloadOnSearch: false,
        allowed: ['metrobus'],
        section: 'metrobus',
        title: 'Seguimiento Metrobus - Detalle',
        views: {
            'body@': {
                templateUrl: '/views/metrobus/detalle.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/metrobus/navbar.html'
            }
        }
    }
};