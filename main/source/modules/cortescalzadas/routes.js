exports = module.exports = {
    '/cortescalzadas/nuevo': {
        title: 'Nuevo Corte de Calzada',
        section: 'cortescalzadas',
        allowed: ['cortescalzadas'],
        views: {
            'body@': {
                templateUrl: '/views/cortescalzadas/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/cortescalzadas/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/cortescalzadas/compromisos/nuevo': {
        title: 'Corte de Calzada - Nuevo Compromiso',
        section: 'cortescalzadas.compromisos',
        allowed: ['cortescalzadas'],
        views: {
            'body@': {
                templateUrl: '/views/cortescalzadas/compromisoNuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/cortescalzadas/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/cortescalzadas/compromisos/:_id': {
        title: 'Corte de Calzada - Detalle Compromiso',
        section: 'cortescalzadas.compromisos',
        allowed: ['cortescalzadas'],
        views: {
            'body@': {
                templateUrl: '/views/cortescalzadas/compromisoDetalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/cortescalzadas/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/cortescalzadas/compromisos': {
        title: 'Corte de Calzada - Compromisos',
        section: 'cortescalzadas.compromisos',
        allowed: ['cortescalzadas'],
        views: {
            'body@': {
                templateUrl: '/views/cortescalzadas/compromisos.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/cortescalzadas/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/cortescalzadas/:_id': {
        title: 'Detalle Corte de Calzada',
        section: 'cortescalzadas',
        allowed: ['cortescalzadas'],
        views: {
            'body@': {
                templateUrl: '/views/cortescalzadas/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/cortescalzadas/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/cortescalzadas': {
        title: 'Cortes de Calzadas',
        section: 'cortescalzadas',
        allowed: ['cortescalzadas'],
        views: {
            'body@': {
                templateUrl: '/views/cortescalzadas/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/cortescalzadas/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};