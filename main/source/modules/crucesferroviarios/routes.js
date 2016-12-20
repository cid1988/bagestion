exports = module.exports = {
    '/crucesFerroviarios': {
        section: 'crucesFerroviarios',
        title: 'Cruces Ferroviarios',
        reloadOnSearch: true,
        allowed: ['crucesFerroviarios'],
        parents: ['/crucesFerroviarios'],
        views: {
            'body@': {
                controller: 'CrucesFerroviariosCtrl',
                templateUrl: '/views/crucesFerroviarios/index.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/crucesFerroviarios/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/crucesFerroviarios/navbarRight.html'
            }
        }
    },
    '/crucesFerroviarios/nuevo': {
        section: 'crucesFerroviarios',
        title: 'Nuevo Cruce Ferroviario',
        reloadOnSearch: true,
        allowed: ['crucesFerroviarios'],
        parents: ['/crucesFerroviarios'],
        views: {
            'body@': {
                controller: 'NuevoCruceFerroviarioCtrl',
                templateUrl: '/views/crucesFerroviarios/nuevo.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/crucesFerroviarios/navbar.html'
            }
        }
    },
    '/crucesFerroviarios/print': {
        section: 'crucesFerroviarios',
        title: 'Cruces Ferroviarios',
        reloadOnSearch: true,
        allowed: ['crucesFerroviarios'],
        parents: ['/crucesFerroviarios'],
        views: {
            'body@': {
                controller: 'CrucesFerroviariosPrintCtrl',
                templateUrl: '/views/crucesFerroviarios/print.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/crucesFerroviarios/navbar.html'
            }
        }
    },
    '/crucesFerroviarios/:id': {
        section: 'crucesFerroviarios',
        title: 'Cruce Ferroviario',
        reloadOnSearch: false,
        allowed: ['crucesFerroviarios'],
        parents: ['/crucesFerroviarios'],
        views: {
            'body@': {
                controller: 'CrucesFerroviariosCtrl',
                templateUrl: '/views/crucesFerroviarios/index.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/crucesFerroviarios/navbar.html'
            }
        }
    }
};