exports = module.exports = {
    '/upejol': {
        section: 'upejol',
        title: 'UPEJOL - Gestión Presupuestaria',
        reloadOnSearch: true,
        allowed: ['upejol'],
        parents: ['/upejol'],
        views: {
            'body@': {
                controller: 'UPEJOLHomeCtrl',
                templateUrl: '/views/upejol/home.html',
            },'navbar-extra-right@': {
                templateUrl: '/views/upejol/navbar-right.html'
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/upejol/home-navbar.html'
            },
        }
    },
    '/upejol/nuevo-plan': {
        section: 'upejol',
        title: 'UPEJOL - Gestión Presupuestaria',
        reloadOnSearch: true,
        allowed: ['upejol'],
        parents: ['/upejol'],
        views: {
            'body@': {
                controller: 'UPEJOLNuevoPlanCtrl',
                templateUrl: '/views/upejol/nuevo-plan.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/upejol/home-navbar.html'
            },
        }
    },
    '/upejol/modifica-plan/:_id': {
        section: 'upejol',
        title: 'UPEJOL - Gestión Presupuestaria',
        reloadOnSearch: true,
        allowed: ['upejol'],
        parents: ['/upejol'],
        views: {
            'body@': {
                controller: 'UPEJOLModificaPlanCtrl',
                templateUrl: '/views/upejol/modifica-plan.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/upejol/home-navbar.html'
            },
        }
    },
    '/upejol/plan/:anio/:etapa': {
        section: 'upejol',
        title: 'UPEJOL - Gestión Presupuestaria',
        reloadOnSearch: false,
        allowed: ['upejol'],
        parents: ['/upejol'],
        views: {
            'body@': {
                controller: 'UPEJOLPlanCtrl',
                templateUrl: '/views/upejol/plan.html',
            },'navbar-extra-right@': {
                controller: 'UPEJOLPlanNavbarCtrl',
                templateUrl: '/views/upejol/plan-navbar-right.html'
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/upejol/home-navbar.html'
            },
        }
    },
    '/upejol/reporte': {
        section: 'reporte',
        title: 'UPEJOL - Gestión Presupuestaria',
        reloadOnSearch: false,
        allowed: ['upejol'],
        parents: ['/upejol'],
        views: {
            'body@': {
                controller: 'UPEJOLReporteCtrl',
                templateUrl: '/views/upejol/reporte.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/upejol/home-navbar.html'
            },
        }
    },
    '/upejol/sigaf': {
        section: 'sigaf',
        title: 'UPEJOL - Gestión Presupuestaria',
        reloadOnSearch: false,
        allowed: ['upejol'],
        parents: ['/upejol'],
        views: {
            'body@': {
                controller: 'UPEJOLSigafCtrl',
                templateUrl: '/views/upejol/sigaf.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/upejol/home-navbar.html'
            },
        }
    },
    '/upejol/configuracion': {
        section: 'upejol',
        title: 'UPEJOL - Configuración ',
        reloadOnSearch: true,
        allowed: ['upejol'],
        parents: ['/upejol'],
        views: {
            'body@': {
                controller: 'UPEJOLHomeCtrl',
                templateUrl: '/views/upejol/configuracion.html',
            },'navbar-extra-right@': {
                templateUrl: '/views/upejol/navbar-right.html'
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/upejol/home-navbar.html'
            },
        }
    }
};
