exports = module.exports = {
    '/funcionarios': {
        section: 'funcionarios',
        title: 'Funcionarios',
        reloadOnSearch: false,
        allowed: ['funcionarios'],
        views: {
            'body@': {
                templateUrl: '/views/funcionarios/index.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/funcionarios/navbar.html'
            }
        }
    },
    '/funcionarios/nuevo': {
        section: 'funcionarios',
        title: 'Nuevo',
        allowed: ['funcionarios'],
        reloadOnSearch: false,
        parents: ['/funcionarios'],
        views: {
            'body@':{
                templateUrl: '/views/funcionarios/nuevo.html',
                controller: 'NuevoFuncionarioCtrl'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/funcionarios/navbar.html'
            }
        }
    },
    '/funcionarios/:_id': {
        section: 'funcionarios',
        title: 'Detalle',
        reloadOnSearch: false,
        allowed: ['funcionarios'],
        parents: ['/funcionarios'],
        views: {
            'body@':{
                templateUrl: '/views/funcionarios/detalle.html',
                controller: 'VerFuncionarioCtrl'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/funcionarios/navbar.html'
            }
        }
    }
};