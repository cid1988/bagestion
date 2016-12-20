exports = module.exports = {
    '/expedientes': {
        title: 'Expedientes',
        allowed: ['expedientes'],
        reloadOnSearch: false,
        controller: 'ExpedientesCtrl',
        views: {
            'body@': {
                templateUrl: '/views/expedientes/expedientes.html',
            },
            'navbar-extra-right@': {
                templateUrl: '/views/expedientes/navbar.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/expedientes/navbar-left.html'
            },
        }
    },
    '/expedientes/print': {
        section: 'expedientes',
        title: 'Imprimir',
        allowed: ['expedientes'],
        reloadOnSearch: false,
        controller: 'PrintExpedientesCtrl',
        parents: ['/expedientes'],
        views: {
            'body@':{
                templateUrl: '/views/expedientes/print.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/expedientes/navbar-left.html'
            },
        }
    },
    '/expedientes/print/:id': {
        section: 'expedientes',
        title: 'Imprimir',
        reloadOnSearch: false,
        parents: ['/expedientes'],
        allowed: ['expedientes'],
        views: {
            'body@': {
                templateUrl: '/views/expedientes/print_detalle.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/expedientes/navbar-left.html'
            },
        }
    },
    '/expedientes/nuevo': {
        section: 'expedientes',
        title: 'Nuevo',
        allowed: ['expedientes'],
        reloadOnSearch: false,
        parents: ['/expedientes'],
        views: {
            'body@': {
                templateUrl: '/views/expedientes/nuevo_expediente.html',
                controller: 'NuevoExpedienteCtrl'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/expedientes/navbar-left.html'
            },
        }
    },
    '/expedientes/:id': {
        allowed: ['expedientes'],
        section: 'expedientes',
        title: 'Detalle',
        reloadOnSearch: false,
        parents: ['/expedientes'],
        views: {
            'body@': {
                controller: 'VerExpedienteCtrl',
                templateUrl: '/views/expedientes/detalle_expediente.html',
            },
            'navbar-extra-right@': {
                templateUrl: '/views/expedientes/navbar.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/expedientes/navbar-left.html'
            },
        }
    }
};