exports = module.exports = {
    '/temas': {
        section: 'temas',
        title: 'EDTe',
        reloadOnSearch: false,
        allowed: ['temas'],
        parents: ['/temas'],
        views: {
            'body@': {
                templateUrl: '/views/temas/temas.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/temas/navbar.html'
            }
        }
    },
    '/temas/nuevo': {
        section: 'temas',
        title: 'EDTe - Nuevo',
        allowed: ['temas'],
        edit: true,
        new: true,
        parents: ['/temas'],
        reloadOnSearch: false,
        views: {
            'body@': {
                templateUrl: '/views/temas/nuevoTema.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/temas/navbar.html'
            }
        }
    },
    '/temas/:_id': {
        reloadOnSearch: false,
        allowed: ['temas'],
        section: 'temas',
        title: 'EDTe - Detalle',
        views: {
            'body@': {
                templateUrl: '/views/temas/detalleTema.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/temas/navbar.html'
            }
        }
    },
    '/temas/:_id/print': {
        reloadOnSearch: false,
        allowed: ['temas'],
        section: 'temas',
        title: 'EDTe - Impresión',
        views: {
            'body@': {
                templateUrl: '/views/temas/temasPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/temas/navbar.html'
            }
        }
    }
};