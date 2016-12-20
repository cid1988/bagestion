exports = module.exports = {
    '/tablero0813': {
        title: 'Tablero 2008/2013',
        allowed: ['tablero0813'],
        reloadOnSearch: false,
        views: {
            'body@': {
                templateUrl: '/views/historicoTablero.html',
            }
        }
    },
    '/tablero0813/proyectos/:proyectoId/hitos': {
        title: 'Tablero 2008/2013',
        allowed: ['tablero0813'],
        reloadOnSearch: false,
        views: {
            'body@': {
                templateUrl: '/views/hitosProyectos.html',
            }
        }
    },
    '/tablero0813/proyectos/:proyectoId/ficha': {
        title: 'Tablero 2008/2013',
        allowed: ['tablero0813'],
        reloadOnSearch: false,
        views: {
            'body@': {
                templateUrl: '/views/fichaVirtual.html',
            }
        }
    }
};