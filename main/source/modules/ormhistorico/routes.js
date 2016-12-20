exports = module.exports = {
    '/ormHistorico/reuniones/:_id/minuta': {//############################################
        section: 'calendario',
        title: 'Minuta de reunión',
        name: 'minuta',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/ormhistorico/minuta/main.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/ormhistorico/navbar.html'},
            'navbar-extra-right@': {
                templateUrl: '/views/ormhistorico/minuta/navbar-right.html'
            }
        }
    },
    // '/ormHistorico/reuniones/:_id/asistencia': {
    //     title: 'Participantes de reunión',
    //     name: 'participantes',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/planillaAsistencia.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'},
    //         'navbar-extra-right@': {}
    //     }
    // },
    '/ormHistorico/reuniones/:_id/editableAsistencia': {//####################################
        title: 'Participantes de reunión',
        name: 'participantes',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/ormhistorico/reunion/editableAsistencia.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/ormhistorico/navbar.html'},
            'navbar-extra-right@': {}
        }
    },
    '/ormHistorico/reuniones/:_id/editableLlamados': {//#####################################
        title: 'Llamados de una reunión',
        name: 'llamados',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/ormhistorico/reunion/editableLlamados.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/ormhistorico/navbar.html'},
            'navbar-extra-right@': {}
        }
    },
    // '/ormHistorico/reuniones/:_id/llamados': {
    //     title: 'Llamados de reunión',
    //     name: 'llamados',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/planillaLlamados.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'},
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/reuniones/:_id/participantesPrint': {
    //     title: 'Participantes',
    //     name: 'participantes',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/participantesPrint.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/reuniones/:_id/citasPrint': {
    //     title: 'Citas',
    //     name: 'citas',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/citasPrint.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/reuniones/:_id/mailsCitasPrint': {
    //     title: 'Citas',
    //     name: 'citas',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/mailsCitasPrint.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/reuniones/:_id/envioPropuestaPrint': {
    //     title: 'Envio de Propuesta',
    //     name: 'envioPropuesta',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/envioPropuestaPrint.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/reuniones/:_id/envioTemarioPrint': {
    //     title: 'Envio de Temario',
    //     name: 'envioTemario',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/envioTemarioPrint.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/reuniones/:_id/envioMinutaPrint': {
    //     title: 'Envio de Minuta',
    //     name: 'envioMinuta',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/envioMinutaPrint.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/reuniones/:_id/mailsPropuestaPrint': {
    //     title: 'Envio de Propuesta',
    //     name: 'envioPropuesta',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/mailsPropuestaPrint.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/reuniones/:_id/mailsTemarioPrint': {
    //     title: 'Envio de Temario',
    //     name: 'envioTemario',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/mailsTemarioPrint.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/reuniones/:_id/mailsMinutaPrint': {
    //     title: 'Envio de Minuta',
    //     name: 'envioMinuta',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/mailsMinutaPrint.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/reuniones/:_id/llamadosPrint': {
    //     title: 'Llamados',
    //     name: 'llamados',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/llamadosPrint.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/reuniones/:_id/calendarioPrint': {
    //     title: 'Calendario',
    //     name: 'calendario',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/calendarioPrint.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/reuniones/:_id/propuestaPrint': {
    //     title: 'Propuesta de Temario',
    //     name: 'calendario',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/propuestaPrint.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {}
    //     }
    // },
    // '/ormHistorico/mi-agenda': {
    //     title: 'Mi agenda',
    //     section: 'mi-agenda',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/mi-agenda/main.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         },
    //         'navbar-extra-right@': {
    //             // templateUrl: '/views/ormhistorico/minuta/navbar-right.html'
    //         }
    //     }
    // },
    '/ormHistorico': {//##########################################################
        title: 'ORM Historico',
        reloadOnSearch: false,
        allowed: ['orm'],
        section: 'historico',
        views: {
            'body@': {
                templateUrl: '/views/ormhistorico/temario/historico.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/ormhistorico/navbar.html'
            }
     }
    },
    // '/ormHistorico/reuniones/maestro': {
    //     reloadOnSearch: false,
    //     allowed: ['orm'],
    //     section: 'calendario',
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/maestro.html',
    //         },
    //         'navbar-extra-right@': {
    //             templateUrl: '/views/ormhistorico/reunion/navbar.html'
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         }
    //     }
    // },
    // '/ormHistorico/reuniones/:_id': {
    //     reloadOnSearch: false,
    //     allowed: ['orm'],
    //     section: 'calendario',
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/reunion/reunion.html',
    //         },
    //         'navbar-extra-right@': {
    //             templateUrl: '/views/ormhistorico/reunion/navbar.html'
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html'
    //         }
    //     }
    // },
    '/ormHistorico/temarios/:_id': {//########################################
        title: 'Temario',
        section: 'temarios',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/ormhistorico/temario/temario.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/ormhistorico/navbar.html',
            },
            'navbar-extra-right@': {
                templateUrl: '/views/ormhistorico/temario/navbar.html',
            }
        }
    },
    // '/ormHistorico/temarios/:_id/vuelta': {
    //     title: 'Vuelta de Temario',
    //     section: 'temarios',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/temario/temarioVuelta.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html',
    //         },
    //         'navbar-extra-right@': {
    //             templateUrl: '/views/ormhistorico/temario/navbarVuelta.html',
    //         }
    //     }
    // },
    // '/ormHistorico/minutas/compromisos': {
    //     title: 'Compromisos',
    //     section: 'compromisos',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/minuta/compromisos.html',
    //         },
    //         'navbar-extra-left@': {
    //             templateUrl: '/views/ormhistorico/navbar.html',
    //         }
    //     }
    // },
    '/ormHistorico/temarios/:_id/print': {//############################################
        title: 'Temario',
        section: 'temarios',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/ormhistorico/temario/temarioPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/ormhistorico/navbar.html',
            }
        }
    },
    '/ormHistorico/minutas/:_id/print': {//#############################################
        title: 'Minuta',
        section: 'calendario',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/ormhistorico/minuta/minutaPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/ormhistorico/navbar.html',
            }
        }
    },
    // '/ormHistorico/temarios/:_id/blanco': {
    //     title: 'Temario',
    //     section: 'temarios',
    //     allowed: ['orm'],
    //     views: {
    //         'body@': {
    //             templateUrl: '/views/ormhistorico/temario/temarioBlanco.html',
    //         }
    //     }
    // }
};