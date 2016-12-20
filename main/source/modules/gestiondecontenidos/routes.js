exports = module.exports = {
    '/gestiondecontenidos/administracion': {
        title: 'Gestion de Contenidos - Administracion',
        section: 'gestiondecontenidos.administracion',
        allowed: ['gestiondecontenidos'],
        views: {
            'body@': {
                templateUrl: '/views/gestiondecontenidos/administracion/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/gestiondecontenidos/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/gestiondecontenidos/insertarMail': {
        title: 'Insertar nuevo correo',
        section: 'gestiondecontenidos',
        allowed: ['gestiondecontenidos'],
        views: {
            'body@': {
                templateUrl: '/views/gestiondecontenidos/insertarMail.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/gestiondecontenidos/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/gestiondecontenidos/nuevo': {
        title: 'Nuevo',
        section: 'gestiondecontenidos',
        allowed: ['gestiondecontenidos'],
        views: {
            'body@': {
                templateUrl: '/views/gestiondecontenidos/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/gestiondecontenidos/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/gestiondecontenidos/:_id': {
        title: 'Detalle Gestion de Contenidos',
        section: 'gestiondecontenidos',
        allowed: ['gestiondecontenidos'],
        views: {
            'body@': {
                templateUrl: '/views/gestiondecontenidos/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/gestiondecontenidos/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/gestiondecontenidos/igestion/:_id': {
        title: 'Detalle Gestion de Contenidos',
        section: 'gestiondecontenidos',
        views: {
            'body@': {
                templateUrl: '/views/gestiondecontenidos/detalleIGestion.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/gestiondecontenidos/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/gestiondecontenidos': {
        title: 'Gestion de Contenidos',
        section: 'gestiondecontenidos',
        allowed: ['gestiondecontenidos'],
        views: {
            'body@': {
                templateUrl: '/views/gestiondecontenidos/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/gestiondecontenidos/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/gestiondecontenidos/navbarRight.html'
            }
        },
        reloadOnSearch: false,
    },
    '/gestiondecontenidos/administracion/nuevo': {
        title: 'Nuevo - Administracion',
        section: 'gestiondecontenidos.administracion',
        allowed: ['gestiondecontenidos'],
        views: {
            'body@': {
                templateUrl: '/views/gestiondecontenidos/administracion/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/gestiondecontenidos/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/gestiondecontenidos/administracion/:_id': {
        title: 'Detalle Gestion de Contenidos - Administracion',
        section: 'gestiondecontenidos.administracion',
        allowed: ['gestiondecontenidos'],
        views: {
            'body@': {
                templateUrl: '/views/gestiondecontenidos/administracion/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/gestiondecontenidos/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/gestiondecontenidos/administracion/igestion/:_id': {
        title: 'Detalle Gestion de Contenidos - Administracion',
        section: 'gestiondecontenidos.administracion',
        allowed: ['gestiondecontenidos'],
        views: {
            'body@': {
                templateUrl: '/views/gestiondecontenidos/administracion/detalleIGestion.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/gestiondecontenidos/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};