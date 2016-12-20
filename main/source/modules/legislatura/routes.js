exports = module.exports = {
    '/preguntas': {
        title: 'Legislatura',
        section: 'legislatura',
        reloadOnSearch: false,
        allowed: ['legislatura'],
        views: {
            'body@': {
                controller: "HomePreguntaCtrl",
                templateUrl: '/views/legislatura/home.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/buscar': {
        section: 'preguntas',
        title: 'Preguntas',
        reloadOnSearch: false,
        allowed: ['legislatura'],
        parents: ['/preguntas'],
        views: {
            'body@': {
                controller: 'PreguntasCtrl',
                templateUrl: '/views/legislatura/preguntas/index.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/print/:id': {
        section: 'preguntas',
        title: 'Imprimir',
        reloadOnSearch: false,
        allowed: ['legislatura'],
        parents: ['/preguntas'],
        views: {
            'body@': {
                controller: 'PrintPreguntaCtrl',
                templateUrl: '/views/legislatura/preguntas/print.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/nueva': {
        section: 'preguntas',
        title: 'Nueva',
        reloadOnSearch: false,
        allowed: ['legislatura'],
        parents: ['/preguntas', '/preguntas/buscar'],
        views: {
            'body@': {
                controller: 'NuevaPreguntaCtrl',
                templateUrl: '/views/legislatura/preguntas/nueva.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/eventos': {
        section: 'eventos',
        title: 'Eventos',
        reloadOnSearch: true,
        allowed: ['legislatura'],
        parents: ['/preguntas'],
        views: {
            'body@': {
                controller: 'EventosCtrl',
                templateUrl: '/views/legislatura/eventos/index_evento.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/cuestionarios': {
        section: 'cuestionarios',
        title: 'Cuestionarios',
        reloadOnSearch: true,
        allowed: ['legislatura'],
        parents: ['/preguntas'],
        views: {
            'body@': {
                controller: 'CuestionariosCtrl',
                templateUrl: '/views/legislatura/cuestionarios/index.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/eventos/print/:id': {
        section: 'eventos',
        title: 'Imprimir',
        reloadOnSearch: false,
        allowed: ['legislatura'],
        parents: ['/preguntas', '/preguntas/eventos'],
        views: {
            'body@': {
                controller: 'PrintEventoCtrl',
                templateUrl: '/views/legislatura/eventos/print.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/eventos/nuevo': {
        section: 'eventos',
        title: 'Nuevo',
        controller: 'NuevoEventoCtrl',
        reloadOnSearch: false,
        parents: ['/preguntas', '/preguntas/eventos'],
        views: {
            'body@': {
                allowed: ['legislatura'],
                templateUrl: '/views/legislatura/eventos/nuevo_evento.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/cuestionarios/print/:id': {
        section: 'cuestionarios',
        title: 'Imprimir',
        reloadOnSearch: false,
        allowed: ['legislatura'],
        parents: ['/preguntas', '/preguntas/cuestionarios'],
        views: {
            'body@': {
                controller: 'VerCuestionarioCtrl',
                templateUrl: '/views/legislatura/cuestionarios/print.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/cuestionarios/nuevo': {
        section: 'cuestionarios',
        title: 'Nuevo',
        reloadOnSearch: false,
        allowed: ['legislatura'],
        parents: ['/preguntas', '/preguntas/cuestionarios'],
        views: {
            'body@': {
                controller: 'NuevoCuestionarioCtrl',
                templateUrl: '/views/legislatura/cuestionarios/nuevo.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/eventos/:id': {
        section: 'eventos',
        title: 'Detalle',
        reloadOnSearch: false,
        allowed: ['legislatura'],
        parents: ['/preguntas', '/preguntas/eventos'],
        views: {
            'body@': {
                controller: 'VerEventoCtrl',
                templateUrl: '/views/legislatura/eventos/detalle_evento.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/cuestionarios/:id': {
        section: 'cuestionarios',
        title: 'Detalle',
        reloadOnSearch: false,
        allowed: ['legislatura'],
        parents: ['/preguntas', '/preguntas/cuestionarios'],
        views: {
            'body@': {
                controller: 'VerCuestionarioCtrl',
                templateUrl: '/views/legislatura/cuestionarios/detalle.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/:id/trazabilidad': {
        section: 'preguntas',
        title: 'Trazabilidad',
        reloadOnSearch: false,
        allowed: ['legislatura'],
        parents: ['/preguntas', '/preguntas/buscar'],
        views: {
            'body@': {
                controller: 'NuevaTrazabilidadCtrl',
                templateUrl: '/views/legislatura/preguntas/nuevaTrazabilidad.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/temas': {
        section: 'preguntas',
        title: 'Temas',
        reloadOnSearch: false,
        allowed: ['legislatura'],
        parents: ['/preguntas'],
        views: {
            'body@': {
                controller: 'TemaPreguntaCtrl',
                templateUrl: '/views/legislatura/temas.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    },
    '/preguntas/:id': {
        section: 'preguntas',
        title: 'Detalle',
        reloadOnSearch: false,
        allowed: ['legislatura'],
        parents: ['/preguntas', '/preguntas/buscar'],
        views: {
            'body@': {
                templateUrl: '/views/legislatura/preguntas/detalle.html',
                controller: 'VerPreguntaCtrl'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/legislatura/navbar.html'
            }
        }
    }
};