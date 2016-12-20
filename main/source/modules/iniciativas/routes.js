exports = module.exports = {
    '/iniciativas': {
        section: 'iniciativas',
        title: 'Iniciativas',
        reloadOnSearch: true,
        allowed: ['iniciativas'],
        parents: ['/iniciativas'],
        views: {
            'body@': {
                controller: 'IniciativasCtrl',
                templateUrl: '/views/iniciativas/index.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/iniciativas/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/iniciativas/navbarRight.html'
            }
        }
    },
    '/iniciativas/nueva': {
        section: 'iniciativas',
        title: 'Nueva Iniciativa',
        reloadOnSearch: true,
        allowed: ['iniciativas'],
        parents: ['/iniciativas'],
        views: {
            'body@': {
                controller: 'NuevaIniciativaCtrl',
                templateUrl: '/views/iniciativas/nueva.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/iniciativas/navbar.html'
            }
        }
    },
    '/iniciativas/printEstados': {
        section: 'iniciativas',
        title: 'Iniciativas',
        reloadOnSearch: true,
        allowed: ['iniciativas'],
        parents: ['/iniciativas'],
        views: {
            'body@': {
                controller: 'IniciativasPrintCtrl',
                templateUrl: '/views/iniciativas/printEstados.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/iniciativas/navbar.html'
            }
        }
    },
    '/iniciativas/:_id': {
        section: 'iniciativas',
        title: 'Detalle',
        reloadOnSearch: false,
        allowed: ['iniciativas'],
        parents: ['/iniciativas'],
        views: {
            'body@': {
                controller: 'VerIniciativaCtrl',
                templateUrl: '/views/iniciativas/detalle.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/iniciativas/navbar.html'
            }
        }
    }
};