exports = module.exports = {
/*    '/constituyentes?situacion=:situacion': {
        section: 'constituyentes',
        title: 'Constituyentes',
        templateUrl: '/views/constituyentes/index.html',
        controller: 'ConstituyentesCtrl',
        reloadOnSearch: false,
        views: {
            'navbar-extra-left@': {
                templateUrl: '/views/constituyentes/navbar.html'
            }
        }
    },*/
    '/constituyentes': {
        section: 'constituyentes',
        title: 'Constituyentes',
        reloadOnSearch: true,
        allowed: ['constituyentes'],
        parents: ['/constituyentes'],
        views: {
            'body@': {
                controller: 'ConstituyentesCtrl',
                templateUrl: '/views/constituyentes/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/constituyentes/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/constituyentes/navbarRight.html'
            }
        }
    },
/*    '/constituyentes/print?situacion=:situacion': {
        section: 'constituyentes',
        title: 'Constituyentes',
        templateUrl: '/views/constituyentes/print.html',
        controller: 'ConstituyentesPrintCtrl',
        reloadOnSearch: false,
        parents: ['/constituyentes'],
        views: {
            'navbar-extra-left@': {
                templateUrl: '/views/constituyentes/navbar.html'
            }
        }
    },*/
    '/constituyentes/print': {
        section: 'constituyentes',
        title: 'Constituyentes',
        reloadOnSearch: true,
        allowed: ['constituyentes'],
        parents: ['/constituyentes'],
        views: {
            'body@': {
                controller: 'ConstituyentesPrintCtrl',
                templateUrl: '/views/constituyentes/print.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/constituyentes/navbar.html'
            }
        }
    },
    '/constituyentes/:id': {
        section: 'constituyentes',
        title: 'Constituyentes',
        reloadOnSearch: false,
        allowed: ['constituyentes'],
        parents: ['/constituyentes'],
        views: {
            'body@': {
                controller: 'ConstituyentesCtrl',
                templateUrl: '/views/constituyentes/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/constituyentes/navbar.html'
            }
        }
    }
};