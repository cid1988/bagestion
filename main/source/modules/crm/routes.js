exports = module.exports = {
    '/crm/reportes': {
        section: 'crm.reportes',
        title: 'Reportes de contactos',
        name: 'estadisticas',
        allowed: ['crm'],
        views: {
            'body@': {
                templateUrl: '/views/crm/reportes.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/crm/navbar.html'},
            'navbar-extra-right@': {}
        }
    },
    '/crm': {
        section: 'crm',
        title: 'CRM',
        reloadOnSearch: false,
        allowed: ['crm'],
        views: {
            'body@': {
                templateUrl: '/views/crm/index.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/crm/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/crm/navbar-right.html'
            }
        }
    },
    '/crm/nuevo': {
        section: 'crm',
        title: 'Nuevo contacto',
        allowed: ['crm'],
        edit: true,
        new: true,
        parents: ['/crm'],
        views: {
            'body@': {
                templateUrl: '/views/crm/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/crm/navbar.html'
            }
        }
    },
    '/crm/detalle/:_id': {
        section: 'crm',
        title: 'CRM',
        reloadOnSearch: false,
        allowed: ['crm'],
        parents: ['/crm'],
        views: {
            'body@': {
                templateUrl: '/views/crm/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/crm/navbar.html'
            }
        }
    },
    '/crm/reportes/:_id': {
        section: 'crm.reportes',
        title: 'CRM',
        reloadOnSearch: false,
        allowed: ['crm'],
        parents: ['/crm'],
        views: {
            'body@': {
                templateUrl: '/views/crm/detalleReporte.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/crm/navbar.html'
            }
        }
    }
};