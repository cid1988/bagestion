exports = module.exports = {
    '/listas': {
        title: 'Listas',
        section: 'listas',
        allowed: ['listas'],
        views: {
            'body@': {
                templateUrl: '/views/listas/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/listas/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/listas/imprimirListas': {
        title: 'Listas',
        section: 'listas',
        allowed: ['listas'],
        views: {
            'body@': {
                templateUrl: '/views/listas/imprimirListas.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/listas/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/listas/imprimirTareas/:_id': {
        title: 'Listas',
        section: 'listas',
        allowed: ['listas'],
        views: {
            'body@': {
                templateUrl: '/views/listas/imprimirTareas.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/listas/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/listas/imprimirSubTareas/:_id': {
        title: 'Listas',
        section: 'listas',
        allowed: ['listas'],
        views: {
            'body@': {
                templateUrl: '/views/listas/imprimirSubTareas.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/listas/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};