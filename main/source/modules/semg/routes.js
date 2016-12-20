exports = module.exports = {
   //PERRO
    '/semg/constru': {
        title: 'En Construcción',
        section: 'semg.constru',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/constru.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/indicadores/:anio/nuevo': {
        title: 'Nuevo Indicador - SEMG',
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/indicadores/:anio/nuevo/:_id': {
        title: 'Nuevo Indicador - SEMG',
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/indicadores/:anio/presentacion': {
        title: 'Presentacion Indicadores - SEMG',
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/presentacion.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/indicadores/:anio/presentacion/:_id': {
        title: 'Presentacion Indicadores - SEMG',
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/detallePresentacion.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/indicadores/:anio/monitoreoReporte': {
        title: 'Monitoreo Indicadores - SEMG',
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/reporteMonitoreo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/indicadores/:anio/monitoreo/:_id': {
        title: 'Monitoreo Indicadores - SEMG',
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/monitoreo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/indicadores/:anio/evaluacion/:_id': {
        title: 'Evaluacion Indicadores - SEMG',
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/evaluacion.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/indicadores/:anio/plandesarrollo/:_id': {
        title: 'Plan de Desarrollo de Indicadores - SEMG',
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/plandesarrollo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/indicadores/:anio/plansistematizacion/:_id': {
        title: 'Plan de Sistematización de Datos - SEMG',
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/plansistematizacion.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/indicadores/:anio/:_id': {
        title: 'Detalle Indicador - SEMG',
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/indicadores/:anio': {
        title: 'SEMG - Indicadores',
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/semg/indicadores/navbar-right.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/cartascompromisos/:anio/nuevo': {
        title: 'Nueva Carta Compromiso - SEMG',
        section: 'semg.cartascompromisos',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/cartascompromisos/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/cartascompromisos/:anio/monitoreoReporte': {
        title: 'Monitoreo Cartas Compromiso - SEMG',
        section: 'semg.cartascompromisos',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/cartascompromisos/reporteMonitoreo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/cartascompromisos/:anio/monitoreo/:_id': {
        title: 'Monitoreo Cartas Compromiso - SEMG',
        section: 'semg.cartascompromisos',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/cartascompromisos/monitoreo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/cartascompromisos/:anio/evaluacion/:_id': {
        title: 'Evaluacion Cartas Compromiso - SEMG',
        section: 'semg.cartascompromisos',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/cartascompromisos/evaluacion.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/cartascompromisos/:anio/:_id': {
        title: 'Detalle Carta Compromiso - SEMG',
        section: 'semg.cartascompromisos',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/cartascompromisos/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/cartascompromisos/:anio': {
        title: 'SEMG - Cartas Compromisos',
        section: 'semg.cartascompromisos',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/cartascompromisos/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/semg/cartascompromisos/navbar-right.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/actualizaciones': {
        title: 'SEMG - Actualizaciones',
        section: 'semg.actualizaciones',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/actualizaciones.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/cartascompromisos/:anio/plandesarrollo/:_id': {
        title: 'Plan de Desarrollo de Indicadores - SEMG',
        section: 'semg.cartascompromisos',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/cartascompromisos/plandesarrollo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/cartascompromisos/:anio/plansistematizacion/:_id': {
        title: 'Plan de Sistematización de Datos - SEMG',
        section: 'semg.cartascompromisos',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/cartascompromisos/plansistematizacion.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/cartascompromisos/:anio/imprimir/:_id': {
        title: 'SEMG - Imprimir - Cartas Compromisos',
        section: 'semg.cartascompromisos',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/cartascompromisos/imprimirTabla.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/indicadores/:anio/imprimirMatriz/:_id': {
        title: 'SEMG - Imprimir - Matriz Indicadores',
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/imprimirMatriz.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg': {
        title: 'SEMG',
        section: 'semg',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    //Nuevo
    '/semg/matrizIndicadores/:anio': {
        section: 'semg.indicadores',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/indicadores/matrizIndicadores.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
            ,
            'navbar-extra-right@': {
                templateUrl: '/views/semg/navbar-right.html'
            }
        },
        reloadOnSearch: false,
    },
    //Nuevo Alex
    '/semg/matrizMonitoreo/:anio': {
        section: 'semg.indicadores',
        title: 'Matriz Monitoreo',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/monitoreo/matrizMonitoreo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/semg/matrizMonitoreo/:anio/:_id': {
        section: 'semg.indicadores',
        title: 'Matriz Monitoreo',
        allowed: ['semg'],
        views: {
            'body@': {
                templateUrl: '/views/semg/monitoreo/matrizMonitoreoDetalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/semg/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};