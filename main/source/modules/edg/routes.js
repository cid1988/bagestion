exports = module.exports = {
    '/edg': {
        section: 'edg',
        title: 'Edg',
        reloadOnSearch: true,
        allowed: ['edg'],
        parents: ['/edg'],
        views: {
            'body@': {
                controller: 'EdgCtrl',
                templateUrl: '/views/edg/edg.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/edg/navbar.html'
            }
        }
    },
};