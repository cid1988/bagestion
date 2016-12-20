exports = module.exports = {
    '/udep/proyectos': {
        title: 'Proyectos',
        section: 'udep.proyectos',
        allowed: ['udep'],
        views: {
            'body@': {
                templateUrl: '/views/udep/proyectos.html'
            },
            'navbar-extra-left@':{
                templateUrl: '/views/udep/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/udep/nuevo': {
        title: 'Nueva Matriz UDEP',
        section: 'udep',
        allowed: ['udep'],
        views: {
            'body@': {
                templateUrl: '/views/udep/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/udep/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/udep/registro/:_id': {
        title: 'Registro UDEP',
        section: 'udep',
        allowed: ['udep'],
        views: {
            'body@': {
                templateUrl: '/views/udep/registro.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/udep/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/udep/nuevo/enviar/:_id': {
        title: 'Enviar Matriz UDEP',
        section: 'udep',
        allowed: ['udep'],
        views: {
            'body@': {
                templateUrl: '/views/udep/enviarMail.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/udep/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/udep/:_id': {
        title: 'Detalle Matriz UDEP',
        section: 'udep',
        allowed: ['udep'],
        views: {
            'body@': {
                templateUrl: '/views/udep/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/udep/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/udep/imprimir/:_id':{
        title: 'Imprimir Matriz UDEP',
        section: 'udep',
        allowerd: ['udep'],
         views: {
            'body@': {
                templateUrl: '/views/udep/imprimir.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/udep/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/udep/imprimirMatriz/:_id':{
        title: 'Imprimir Matriz UDEP',
        section: 'udep',
        allowerd: ['udep'],
         views: {
            'body@': {
                templateUrl: '/views/udep/imprimirMatriz.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/udep/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/udep': {
        title: 'Matriz UDEP',
        section: 'udep',
        allowed: ['udep'],
        views: {
            'body@': {
                templateUrl: '/views/udep/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/udep/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};