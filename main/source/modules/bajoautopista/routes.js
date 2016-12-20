exports = module.exports = {
    '/bajoautopista/autocompletar': {
        title: 'Nuevo Bajo Autopista',
        section: 'bajoautopista',
        allowed: ['bajoautopista'],
        views: {
            'body@': {
                templateUrl: '/views/bajoautopista/autoCompleter.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/bajoautopista/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/bajoautopista/imprimir/:_id': {
        title: 'Imprimir Bajo Autopista',
        section: 'bajoautopista',
        allowed: ['bajoautopista'],
        views: {
            'body@': {
                templateUrl: '/views/bajoautopista/imprimirTabla.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/bajoautopista/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/bajoautopista/nuevo': {
        title: 'Nuevo Bajo Autopista',
        section: 'bajoautopista',
        allowed: ['bajoautopista'],
        views: {
            'body@': {
                templateUrl: '/views/bajoautopista/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/bajoautopista/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/bajoautopista/:_id': {
        title: 'Detalle Bajo Autopista',
        section: 'bajoautopista',
        allowed: ['bajoautopista'],
        views: {
            'body@': {
                templateUrl: '/views/bajoautopista/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/bajoautopista/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/bajoautopista': {
        title: 'Bajo Autopista',
        section: 'bajoautopista',
        allowed: ['bajoautopista'],
        views: {
            'body@': {
                templateUrl: '/views/bajoautopista/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/bajoautopista/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/bajoautopista/navbarRight.html'
            }
        },
        reloadOnSearch: false,
    }
};