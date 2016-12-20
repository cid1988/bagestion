exports = module.exports = {
    '/mejorenbici': {
        title: 'Mejor en Bici',
        name: 'mejorenbici',
        allowed: ['mejorenbici'],
        reloadOnSearch: false,
        section: 'calendario',
        views: {
            'body@': {
                templateUrl: '/views/mejorenbici/calendario/calendario.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/mejorenbici/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/mejorenbici/calendario/navbar.html'
                }
        }
    },
    '/mejorenbici/:_id/print': {
        title: 'Reserva',
        name: 'reserva',
        allowed: ['mejorenbici'],
        views: {
            'body@': {
                templateUrl: '/views/mejorenbici/calendario/print.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/mejorenbici/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    }
};