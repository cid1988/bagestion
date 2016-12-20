exports = module.exports = {
    '/contratadosBA/nuevo': {
        title: 'Nuevo Contratado',
        section: 'contratadosBA',
        allowed: ['contratadosBA'],
        views: {
            'body@': {
                templateUrl: '/views/contratadosBA/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/contratadosBA/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/contratadosBA/:_id': {
        title: 'Detalle Contratado',
        section: 'contratadosBA',
        allowed: ['contratadosBA'],
        views: {
            'body@': {
                templateUrl: '/views/contratadosBA/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/contratadosBA/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/contratadosBA': {
        title: 'Contratados BA',
        section: 'contratadosBA',
        allowed: ['contratadosBA'],
        views: {
            'body@': {
                templateUrl: '/views/contratadosBA/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/contratadosBA/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/contratadosBA/navbarRight.html'
            }
        },
        reloadOnSearch: false,
    },
    '/contratadosBA/imprimir/:_id': {
        title: 'Contratado BA - Imprimir',
        section: 'contratadosBA',
        allowed: ['contratadosBA'],
        views: {
            'body@': {
                templateUrl: '/views/contratadosBA/imprimir.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/contratadosBA/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};