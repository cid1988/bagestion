exports = module.exports = {
    '/selfies': {
        title: 'Selfies',
        section: 'selfies',
        allowed: ['selfies'],
        views: {
            'body@': {
                templateUrl: '/views/selfies/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/selfies/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/selfies/nuevo': {
        title: 'Nuevas selfies',
        section: 'selfies',
        allowed: ['selfies'],
        views: {
            'body@': {
                templateUrl: '/views/selfies/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/selfies/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
    
    };