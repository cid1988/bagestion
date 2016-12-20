exports = module.exports = {
    '/poa': {
        section: 'poa',
        title: 'Plan Operativo Anual',
        reloadOnSearch: true,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                controller: 'POAHomeCtrl',
                templateUrl: '/views/poa/home.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/nuevo-plan': {
        section: 'poa',
        title: 'Plan Operativo Anual',
        reloadOnSearch: true,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                controller: 'POANuevoPlanCtrl',
                templateUrl: '/views/poa/nuevo-plan.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/modifica-plan/:_id': {
        section: 'poa',
        title: 'Plan Operativo Anual',
        reloadOnSearch: true,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                controller: 'POAModificaPlanCtrl',
                templateUrl: '/views/poa/modifica-plan.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/rdg/:_id': {
        section: 'poa',
        title: 'RDG',
        reloadOnSearch: true,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                templateUrl: '/views/rdg/detalle.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/rdg': {
        section: 'poa',
        title: 'RDG',
        reloadOnSearch: true,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                templateUrl: '/views/rdg/index.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/configuracion': {
        section: 'poa',
        title: 'POA - Configuración',
        reloadOnSearch: true,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                templateUrl: '/views/poa/configuracion.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/rdp': {
        section: 'poa',
        title: 'RDP',
        reloadOnSearch: true,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                templateUrl: '/views/rdp/index.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/rdp/:_id': {
        section: 'poa',
        title: 'RDP',
        reloadOnSearch: true,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                templateUrl: '/views/rdp/jurisdiccion.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/rdp/impacto/:_id': {
        section: 'poa',
        title: 'RDP',
        reloadOnSearch: true,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                templateUrl: '/views/rdp/impacto.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/rdp/operativo/:_id': {
        section: 'poa',
        title: 'RDP',
        reloadOnSearch: true,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                templateUrl: '/views/rdp/operativo.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/rdp/proyecto/:_id': {
        section: 'poa',
        title: 'RDP',
        reloadOnSearch: true,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                templateUrl: '/views/rdp/proyecto.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/rdp/hitos/:_id': {
        section: 'poa',
        title: 'RDP',
        reloadOnSearch: true,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                templateUrl: '/views/rdp/hitos.html',
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/plan/:anio/:etapa/obras/:_id': {
        section: 'poa',
        title: 'Plan Operativo Anual',
        reloadOnSearch: false,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                controller: 'POAPlanObrasCtrl',
                templateUrl: '/views/poa/plan-jurisdiccionObras.html',
            },'navbar-extra-right@': {
                controller: 'POAPlanNavbarCtrl',
                templateUrl: '/views/poa/plan-navbar-right.html'
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    },
    '/poa/plan/:anio/:etapa': {
        section: 'poa',
        title: 'Plan Operativo Anual',
        reloadOnSearch: false,
        allowed: ['poa'],
        parents: ['/poa'],
        views: {
            'body@': {
                controller: 'POAPlanCtrl',
                templateUrl: '/views/poa/plan.html',
            },'navbar-extra-right@': {
                controller: 'POAPlanNavbarCtrl',
                templateUrl: '/views/poa/plan-navbar-right.html'
            }
            ,'navbar-extra-left@': {
                templateUrl: '/views/poa/home-navbar.html'
            },
        }
    }
};
