exports = module.exports = {
    '/comunas': {
        title: 'Comunas',
        section: 'comunas',
        allowed: ['comunas'],
        views: {
            'body@': {
                templateUrl: '/views/comunas/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/comunas/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/comunas/:_id': {
        title: 'Detalle',
        section: 'comunas',
        reloadOnSearch: false,
        allowed: ['comunas'],
        parents: ['/comunas'],
        views: {
            'body@': {
                templateUrl: '/views/comunas/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/comunas/navbar.html'
            }
        }
    }
};