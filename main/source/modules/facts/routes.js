exports = module.exports = {
    '/facts/nuevo': {
        title: 'Nuevo BA Fact',
        section: 'facts',
        allowed: ['facts'],
        views: {
            'body@': {
                templateUrl: '/views/facts/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/facts/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/facts/:_id': {
        title: 'Detalle BA Fact',
        section: 'facts',
        allowed: ['facts'],
        views: {
            'body@': {
                templateUrl: '/views/facts/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/facts/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/facts': {
        title: 'BA Facts',
        section: 'facts',
        allowed: ['facts'],
        views: {
            'body@': {
                templateUrl: '/views/facts/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/facts/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/facts/navbarRight.html'
            }
        },
        reloadOnSearch: false,
    }
};