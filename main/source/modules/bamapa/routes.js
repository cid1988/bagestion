exports = module.exports = {
    '/bamapa': {
        title: 'BA Mapa',
        section: 'bamapa',
        allowed: ['bamapa'],
        views: {
            'body@': {
                templateUrl: '/views/bamapa/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/bamapa/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};