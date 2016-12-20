exports = module.exports = {
    '/planificacion20162019/reporte': {
        title: 'Reporte Planificación 2016 - 2019',
        section: 'planificacion20162019',
        allowed: ['planificacion20162019'],
        views: {
            'body@': {
                templateUrl: '/views/planificacion20162019/reporteHoracio.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/planificacion20162019/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/planificacion20162019/nuevo': {
        title: 'Nuevo Planificación 2016 - 2019',
        section: 'planificacion20162019',
        allowed: ['planificacion20162019'],
        views: {
            'body@': {
                templateUrl: '/views/planificacion20162019/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/planificacion20162019/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/planificacion20162019/compromisos': {
        title: 'Compromisos Planificación 2016 - 2019',
        section: 'planificacion20162019',
        allowed: ['planificacion20162019'],
        views: {
            'body@': {
                templateUrl: '/views/planificacion20162019/compromisos.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/planificacion20162019/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/planificacion20162019/comentariosHRL': {
        title: 'Comentarios HRL Planificación 2016 - 2019',
        section: 'planificacion20162019',
        allowed: ['planificacion20162019'],
        views: {
            'body@': {
                templateUrl: '/views/planificacion20162019/consolidadoHRL.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/planificacion20162019/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/planificacion20162019/comentariosDGPLE': {
        title: 'Comentarios DGPLE Planificación 2016 - 2019',
        section: 'planificacion20162019',
        allowed: ['planificacion20162019'],
        views: {
            'body@': {
                templateUrl: '/views/planificacion20162019/consolidadoDGPLE.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/planificacion20162019/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/planificacion20162019/:_id': {
        title: 'Detalle Planificación 2016 - 2019',
        section: 'planificacion20162019',
        allowed: ['planificacion20162019'],
        views: {
            'body@': {
                templateUrl: '/views/planificacion20162019/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/planificacion20162019/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/planificacion20162019': {
        title: 'Planificación 2016 - 2019',
        section: 'planificacion20162019',
        allowed: ['planificacion20162019'],
        views: {
            'body@': {
                templateUrl: '/views/planificacion20162019/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/planificacion20162019/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/planificacion20162019/navbar-right.html'
            }
        },
        reloadOnSearch: false,
    }
};