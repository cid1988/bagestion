exports = module.exports = {
    '/bawiki': {
        title: 'BA Wiki',
        section: 'bawiki',
        allowed: ['bawiki'],
        views: {
            'body@': {
                templateUrl: '/views/bawiki/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/bawiki/navbar.html'
            }
        },
        reloadOnSearch: false,
    }, 
    '/bawiki/nuevo': {
        title: 'BA Wiki - Nuevo',
        section: 'bawiki',
        allowed: ['bawiki.editar'],
        views: {
            'body@': {
                templateUrl: '/views/bawiki/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/bawiki/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/bawiki/detalle/:_id': {
        title: 'BA Wiki - Detalle',
        section: 'bawiki',
        allowed: ['bawiki'],
        views: {
            'body@': {
                templateUrl: '/views/bawiki/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/bawiki/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
    
};