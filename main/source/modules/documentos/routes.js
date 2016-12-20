exports = module.exports = {
    '/documentos': {
        title: 'Documentos',
        section: 'documentos',
        allowed: ['documentos'],
        views: {
            'body@': {
                templateUrl: '/views/documentos/documentos.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/documentos/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/documentos/navbarRight.html'
            }
        },
        reloadOnSearch: false,
    },
    '/documentos/fotos': {
        title: 'Documentos',
        section: 'fotos',
        allowed: ['documentos'],
        views: {
            'body@': {
                templateUrl: '/views/documentos/fotos.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/documentos/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/documentos/navbarRight.html'
            }
        },
        reloadOnSearch: false,
    }
};