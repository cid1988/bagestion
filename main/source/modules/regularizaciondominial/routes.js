exports = module.exports = {
    '/regularizacionDominial': {
        section: 'regularizacionDominial',
        title: 'Regularizacion Dominial',
        reloadOnSearch: true,
        allowed: ['regularizacionDominial'],
        parents: ['/regularizacionDominial'],
        views: {
            'body@': {
                controller: 'RegularizacionDominialCtrl',
                templateUrl: '/views/regularizacionDominial/index.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/regularizacionDominial/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/regularizacionDominial/navbarRight.html'
            }
        }
    },
    '/regularizacionDominial/reportetodos': {
        section: 'regularizacionDominial',
        title: 'Regularizacion Dominial',
        reloadOnSearch: true,
        allowed: ['regularizacionDominial'],
        parents: ['/regularizacionDominial'],
        views: {
            'body@': {
                controller: 'RegularizacionDominialCtrl',
                templateUrl: '/views/regularizacionDominial/reporteTodos.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/regularizacionDominial/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/regularizacionDominial/navbarRight.html'
            }
        }
    },
    '/regularizacionDominial/nueva': {
        section: 'regularizacionDominial',
        title: 'Nueva Regularizacion Dominial',
        reloadOnSearch: true,
        allowed: ['regularizacionDominial'],
        parents: ['/regularizacionDominial'],
        views: {
            'body@': {
                templateUrl: '/views/regularizacionDominial/nueva.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/regularizacionDominial/navbar.html'
            }
        }
    },
    '/regularizacionDominial/print': {
        section: 'regularizacionDominial',
        title: 'Regularizacion Dominial',
        reloadOnSearch: true,
        allowed: ['regularizacionDominial'],
        parents: ['/regularizacionDominial'],
        views: {
            'body@': {
                controller: 'RegularizacionDominialPrintCtrl',
                templateUrl: '/views/regularizacionDominial/print.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/regularizacionDominial/navbar.html'
            }
        }
    },
    '/regularizacionDominial/reporte': {
        section: 'regularizacionDominial',
        title: 'Regularizacion Dominial',
        reloadOnSearch: true,
        allowed: ['regularizacionDominial'],
        parents: ['/regularizacionDominial'],
        views: {
            'body@': {
                templateUrl: '/views/regularizacionDominial/reporte.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/regularizacionDominial/navbar.html'
            }
        }
    },
    '/regularizacionDominial/:id': {
        section: 'regularizacionDominial',
        title: 'Regularizacion Dominial',
        reloadOnSearch: false,
        allowed: ['regularizacionDominial'],
        parents: ['/regularizacionDominial'],
        views: {
            'body@': {
                templateUrl: '/views/regularizacionDominial/detalle.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/regularizacionDominial/navbar.html'
            }
        }
    }
};