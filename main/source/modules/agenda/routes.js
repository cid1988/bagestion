exports = module.exports = {
    '/agenda': {
        title: 'Agendas de Reuniones',
        name: 'agenda',
        allowed: ['agenda'],
        reloadOnSearch: false,
        section: 'agenda',
        views: {
            'body@': {
                templateUrl: '/views/agenda/calendario/calendario.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/agenda/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/agenda/calendario/navbar.html'
                }
        }
    },
    '/agenda/:_id/minuta': {
        section: 'agenda',
        title: 'Minuta de reunión',
        name: 'minuta',
        allowed: ['agenda'],
        views: {
            'body@': {
                templateUrl: '/views/agenda/minuta/main.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/agenda/navbar.html'},
            'navbar-extra-right@': {
                templateUrl: '/views/agenda/minuta/navbar-right.html'
            }
        }
    },
    '/agenda/minutas/:_id/print': {
        title: 'Minuta',
        section: 'agenda',
        allowed: ['agenda'],
        views: {
            'body@': {
                templateUrl: '/views/agenda/minuta/minutaPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/agenda/navbar.html',
            }
        }
    },
    '/agenda/enviarMail/:_id': {
        title: 'Enviar Correo',
        section: 'agenda',
        allowed: ['agenda'],
        views: {
            'body@': {
                templateUrl: '/views/agenda/calendario/cards/enviarCorreo.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/agenda/navbar.html',
            }
        }
    },
    '/agenda/:_id/participantes': {
        section: 'agenda',
        title: 'Participantes de reunión',
        name: 'participantes',
        allowed: ['agenda'],
        views: {
            'body@': {
                templateUrl: '/views/agenda/participantes/editableAsistencia.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/agenda/navbar.html'}
        }
    },
    '/agenda/participantes/:_id/print': {
        title: 'Participantes',
        section: 'agenda',
        allowed: ['agenda'],
        views: {
            'body@': {
                templateUrl: '/views/agenda/participantes/planillaAsistencia.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/agenda/navbar.html',
            }
        }
    },
    '/agenda/temarios/:_id': {
        title: 'Temario',
        section: 'temarios',
        allowed: ['agenda'],
        views: {
            'body@': {
                templateUrl: '/views/agenda/temario/temario.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/agenda/navbar.html',
            },
            'navbar-extra-right@': {
                templateUrl: '/views/agenda/temario/navbar.html',
            }
        }
    },
    '/agenda/temarios': {
        title: 'Temarios',
        section: 'temarios',
        allowed: ['agenda'],
        views: {
            'body@': {
                templateUrl: '/views/agenda/temario/temarios.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/agenda/navbar.html',
            }
        }
    },
    '/agenda/minutas/compromisos': {
        title: 'Compromisos',
        section: 'compromisos',
        allowed: ['agenda'],
        views: {
            'body@': {
                templateUrl: '/views/agenda/minuta/compromisos.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/agenda/navbar.html',
            }
        }
    },
    '/agenda/historico': {
        title: 'Archivo Histórico',
        section: 'historico',
        allowed: ['agenda'],
        views: {
            'body@': {
                templateUrl: '/views/agenda/temario/historico.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/agenda/navbar.html',
            }
        }
    },
    '/agenda/temarios/:_id/print': {
        title: 'Temario',
        section: 'temarios',
        allowed: ['agenda'],
        views: {
            'body@': {
                templateUrl: '/views/agenda/temario/temarioPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/agenda/navbar.html',
            }
        }
    },
    '/agenda/temarios/:_id/blanco': {
        title: 'Temario',
        section: 'temarios',
        allowed: ['agenda'],
        views: {
            'body@': {
                templateUrl: '/views/agenda/temario/temarioBlanco.html',
            }
        }
    }
};