exports = module.exports = {
    '/dashboard': {
        title: 'Dashboard',
        section: 'dashboard',
        views: {
            'body@': {
                templateUrl: '/views/dashboard/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/dashboard/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/dashboard/compromisosORM': {
        title: 'Dashboard - Compromisos',
        section: 'dashboard',
        views: {
            'body@': {
                templateUrl: '/views/dashboard/compromisosORM.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/dashboard/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/dashboard/compromisosPE': {
        title: 'Dashboard - Compromisos',
        section: 'dashboard',
        views: {
            'body@': {
                templateUrl: '/views/dashboard/compromisosPE.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/dashboard/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/dashboard/obras': {
        title: 'Dashboard - Obras',
        section: 'dashboard',
        views: {
            'body@': {
                templateUrl: '/views/dashboard/fixtureObras.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/dashboard/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};