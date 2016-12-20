exports = module.exports = {
    '/enviarMails': {
        title: 'Enviar Mails',
        section: 'enviarMails',
        allowed: ['enviarMails.acceso'],
        views: {
            'body@': {
                templateUrl: '/views/enviarMails/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/enviarMails/navbars/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/enviarMails/navbars/navbarRight.html'
            }
        },
        reloadOnSearch: false,
    }
};