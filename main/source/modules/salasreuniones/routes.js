exports = module.exports = {
    '/salasreuniones': {
        title: 'Salas de Reuniones',
        name: 'salasreuniones',
        allowed: ['salasreuniones'],
        reloadOnSearch: false,
        section: 'calendario',
        views: {
            'body@': {
                templateUrl: '/views/salasreuniones/calendario/calendario.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/salasreuniones/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/salasreuniones/calendario/navbar.html'
                }
        }
    },
    '/salasreuniones/registrosalas': {
        title: 'Salas de Reuniones - Registro Salas',
        name: 'registrosalas',
        allowed: ['salasreuniones'],
        section: 'calendario.registrosalas',
        views: {
            'body@': {
                templateUrl: '/views/salasreuniones/calendario/registrosalas.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/salasreuniones/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/salasreuniones/reporte': {
        title: 'Salas de Reuniones - Reportes',
        name: 'salasreuniones',
        allowed: ['salasreuniones'],
        section: 'calendario',
        views: {
            'body@': {
                templateUrl: '/views/salasreuniones/calendario/reporte.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/salasreuniones/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/salasreuniones/registro': {
        title: 'Salas de Reuniones',
        name: 'registro',
        views: {
            'body@': {
                templateUrl: '/views/salasreuniones/registro.html',
            },
            'navbar-extra-left@': {},
            'navbar-extra-right@': {}
        }
    },
    '/salasreuniones/consulta': {
        title: 'Salas de Reuniones - Consulta',
        name: 'consulta',
        section: 'calendario.consulta',
        views: {
            'body@': {
                templateUrl: '/views/salasreuniones/calendario/consulta.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/salasreuniones/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/salasreuniones/:_id/print': {
        title: 'Reserva',
        name: 'reserva',
        allowed: ['salasreuniones'],
        views: {
            'body@': {
                templateUrl: '/views/salasreuniones/calendario/print.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/salasreuniones/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    }
};