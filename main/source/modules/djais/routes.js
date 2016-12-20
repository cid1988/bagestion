exports = module.exports = {
    '/djais/nuevo': {
        title: 'Nuevo DJAI',
        section: 'djais',
        allowed: ['djais'],
        views: {
            'body@': {
                templateUrl: '/views/djais/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/djais/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/djais/:_id': {
        title: 'Detalle DJAI',
        section: 'djais',
        allowed: ['djais'],
        views: {
            'body@': {
                templateUrl: '/views/djais/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/djais/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/djais': {
        title: 'DJAI´s',
        section: 'djais',
        allowed: ['djais'],
        views: {
            'body@': {
                templateUrl: '/views/djais/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/djais/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};