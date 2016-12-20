exports = module.exports = {
    '/fiscales': {
        section: 'fiscales',
        title: 'Eventos - Fiscales',
        reloadOnSearch: false,
        views: {
            'body@': {
                templateUrl: '/views/fiscales/home.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/fiscales/navbar.html'
            }
        }
    },
    '/fiscales/:_id': {
        section: 'fiscales',
        title: 'Fiscales',
        reloadOnSearch: false,
        views: {
            'body@': {
                templateUrl: '/views/fiscales/index.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/fiscales/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/fiscales/navbar-right.html'
            }
        }
    },
    '/fiscales/nuevo/:_id': {
        section: 'fiscales',
        title: 'Nuevo fiscal',
        edit: true,
        new: true,
        parents: ['/fiscales'],
        views: {
            'body@': {
                templateUrl: '/views/fiscales/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/fiscales/navbar.html'
            }
        }
    },
    '/fiscales/detalle/:_id': {
        section: 'fiscales',
        title: 'Fiscal',
        reloadOnSearch: false,
        parents: ['/fiscales'],
        views: {
            'body@': {
                templateUrl: '/views/fiscales/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/fiscales/navbar.html'
            }
        }
    },
};