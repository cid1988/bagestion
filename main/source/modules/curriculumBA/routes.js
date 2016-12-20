exports = module.exports = {
    '/curriculumBA/nuevo': {
        title: 'Nuevo CV',
        section: 'curriculumBA',
        allowed: ['rhResumeTool'],
        views: {
            'body@': {
                templateUrl: '/views/curriculumBA/nuevo.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/curriculumBA/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/curriculumBA/:_id': {
        title: 'Detalle CV',
        section: 'curriculumBA',
        allowed: ['rhResumeTool'],
        views: {
            'body@': {
                templateUrl: '/views/curriculumBA/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/curriculumBA/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/curriculumBA': {
        title: 'Curriculum BA',
        section: 'curriculumBA',
        allowed: ['rhResumeTool'],
        views: {
            'body@': {
                templateUrl: '/views/curriculumBA/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/curriculumBA/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/curriculumBA/navbarRight.html'
            }
        },
        reloadOnSearch: false,
    },
    '/curriculumBA/imprimir/:_id': {
        title: 'Curriculum BA - Imprimir',
        section: 'curriculumBA',
        allowed: ['rhResumeTool'],
        views: {
            'body@': {
                templateUrl: '/views/curriculumBA/imprimir.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/curriculumBA/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};