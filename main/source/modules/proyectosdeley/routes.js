exports = module.exports = {
    '/proyectosdeley': {
        section: 'Pdl',
        title: 'Proyectos de Ley',
        reloadOnSearch: true,
        allowed: ['proyectosdeley'],
        parents: ['/proyectosdeley'],
        views: {
            'body@': {
                controller: 'PdlCtrl',
                templateUrl: '/views/proyectosdeley/proyectosDeLey.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/proyectosdeley/navbar-left.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/proyectosdeley/navbar-right.html'
            }
        }
    },
    '/proyectosdeley/print': {
        section: 'impresion',
        title: 'Impresion',
        reloadOnSearch: false,
        allowed: ['proyectosdeley'],
        parents: ['/proyectosdeley'],
        views: {
            'body@': {
                controller: 'printPdlCtrl',
                templateUrl: '/views/proyectosdeley/print.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/proyectosdeley/navbar-left.html'
            },
        }
    },
    '/proyectosdeley/nuevo': {
        section: 'NuevoPdl',
        title: 'Nuevo Proyecto de Ley',
        reloadOnSearch: true,
        allowed: ['proyectosdeley'],
        parents: ['/proyectosdeley'],
        views: {
            'body@': {
                controller: 'nuevoPdlCtrl',
                templateUrl: '/views/proyectosdeley/nuevoPdl.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/proyectosdeley/navbar-left.html'
            },
        }
    },
    '/proyectosdeley/:_id': {
        section: 'detallePdl',
        title: 'Detalle',
        reloadOnSearch: false,
        allowed: ['proyectosdeley'],
        parents: ['/proyectosdeley'],
        views: {
            'body@': {
                controller: 'detallePdlCtrl',
                templateUrl: '/views/proyectosdeley/detallePdl.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/proyectosdeley/navbar-left.html'
            },
        }
    }
};