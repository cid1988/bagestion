exports = module.exports = {
    '/tareas': {
        title: 'Tareas',
        section: 'tareas',
        allowed: ['tareas'],
        views: {
            'body@': {
                templateUrl: '/views/tareas/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/tareas/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};