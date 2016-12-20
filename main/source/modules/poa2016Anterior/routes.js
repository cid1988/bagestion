exports = module.exports = {
    '/poa2016Anterior': {
        section: 'poa',
        title: 'Plan Operativo Anual',
        reloadOnSearch: true,
        allowed: ['poa.poa2016Anterior'],
        parents: ['/poa'],
        views: {
            'body@': {
                controller: 'POAPlanAnteriorCtrl',
                templateUrl: '/views/poa2016Anterior/plan.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa2016Anterior/plan/:anio/:etapa': {
        section: 'poa',
        title: 'Plan Operativo Anual',
        reloadOnSearch: false,
        allowed: ['poa.poa2016Anterior'],
        parents: ['/poa'],
        views: {
            'body@': {
                controller: 'POAPlanAnteriorCtrl',
                templateUrl: '/views/poa2016Anterior/plan.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    }
};
