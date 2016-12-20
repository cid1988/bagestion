exports = module.exports = {
    '/obras': {
        section: 'obras',
        title: 'Obras',
        reloadOnSearch: true,
        allowed: ['obras'],
        parents: ['/obras'],
        views: {
            'body@': {
                controller: 'ObrasCtrl',
                templateUrl: '/views/obras/obras.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    },
    '/obras/admin': {
        section: 'admin',
        title: 'Admin',
        reloadOnSearch: true,
        allowed: ['obras'],
        parents: ['/obras'],
        views: {
            'body@': {
                controller: 'adminObrasCtrl',
                templateUrl: '/views/obras/admin.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    },
    '/obras/print': {
        section: 'obras',
        title: 'Imprimir',
        allowed: ['obras'],
        reloadOnSearch: false,
        controller: 'ObrasCtrl',
        parents: ['/obras'],
        views: {
            'body@':{
                templateUrl: '/views/obras/print.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    },
    '/obras/presentacion': {
        section: 'obras',
        title: 'Obras',
        reloadOnSearch: true,
        allowed: ['obras'],
        parents: ['/obras'],
        views: {
            'body@': {
                controller: 'presentacionesCtrl',
                templateUrl: '/views/obras/presentacion.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    },
    '/obras/reportes/reporteRelevamientos': {
        section: 'obras',
        title: 'Obras',
        reloadOnSearch: true,
        allowed: ['obras'],
        parents: ['/obras'],
        views: {
            'body@': {
                controller: 'ReporteRelevamientosCtrl',
                templateUrl: '/views/obras/reportes/reporteRelevamientos.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    },
    '/obras/pdf': {
        section: 'pdf',
        title: 'Pdf',
        reloadOnSearch: true,
        allowed: ['obras'],
        parents: ['/obras'],
        views: {
            'body@': {
                controller: 'pdfCtrl',
                templateUrl: '/views/obras/pdf.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    },
    '/obras/relevamientos': {
        section: 'relevamientos',
        title: 'Relevamientos',
        reloadOnSearch: true,
        allowed: ['obras'],
        parents: ['/obras'],
        views: {
            'body@': {
                controller: 'RelevamientosCtrl',
                templateUrl: '/views/obras/relevamientos/relevamientos.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    },
    '/obras/fixture': {
        section: 'fixture',
        title: 'Fixture',
        reloadOnSearch: true,
        allowed: ['obras'],
        parents: ['/obras'],
        views: {
            'body@': {
                controller: 'fixtureCtrl',
                templateUrl: '/views/obras/fixture.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    },
    '/obras/fichaRelevador': {
        section: 'relevamientos',
        title: 'Relevamientos',
        reloadOnSearch: true,
        allowed: ['obras'],
        parents: ['/obras'],
        views: {
            'body@': {
                controller: 'FichaRelevadorCtrl',
                templateUrl: '/views/obras/relevamientos/fichaRelevador.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    },
    '/obras/nueva': {
        section: 'nuevaObra',
        title: 'Nueva Obra',
        reloadOnSearch: true,
        allowed: ['obras'],
        parents: ['/obras'],
        views: {
            'body@': {
                controller: 'NuevaObraCtrl',
                templateUrl: '/views/obras/nueva.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    },
    // '/obras/reportes': {
    //     section: 'reportes',
    //     title: 'Reportes',
    //     reloadOnSearch: true,
    //     allowed: ['obras'],
    //     parents: ['/obras'],
    //     views: {
    //         'body@': {
    //             controller: 'ReportesObrasCtrl',
    //             templateUrl: '/views/obras/reportes.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/obras/navbar.html'
    //         },
    //         'navbar-extra-right@': {
    //             templateUrl: '/views/obras/navbarRight.html'
    //         }
    //     }
    // },
    '/obras/reportes': {
        section: 'reportes',
        title: 'Reportes',
        reloadOnSearch: true,
        allowed: ['obras'],
        parents: ['/obras'],
        views: {
            'body@': {
                controller: 'ReporteObrasPoaCtrl',
                templateUrl: '/views/obras/reportes/reportes.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    },
    '/obras/:_id': {
        section: 'obras',
        title: 'Detalle',
        reloadOnSearch: false,
        allowed: ['obras'],
        parents: ['/obras'],
        views: {
            'body@': {
                controller: 'VerObraCtrl',
                templateUrl: '/views/obras/detalle.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    },
    '/obras/fichaRelevador/nuevoRelevamiento/:_id': {
        section: 'nuevoRelevamiento',
        title: 'Nuevo Relevamiento',
        reloadOnSearch: true,
        allowed: ['obras'],
        parents: ['/obras'],
        views: {
            'body@': {
                controller: 'NuevoRelevamientoCtrl',
                templateUrl: '/views/obras/relevamientos/nuevoRelevamiento.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/obras/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/obras/navbarRight.html'
            }
        }
    }
};