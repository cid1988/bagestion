exports = module.exports = [{
    // Se guardaran todos los logs de un envio de mails, contenido, para, cc, cco, usuario, listas que se usaron, fechas TODO.
    name: 'MailsEnviadosLog',
    collectionName: 'envioMails.mailsEnviadosLog',
    url: '/envioMails.mailsEnviadosLog/:_id',
    params:  {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/envioMails.mailsEnviadosLog'],
            kind: 'find'
        },
        findById:  {
            kind: 'findOne'
        },
        save:  {
            urls: ['/envioMails.mailsEnviadosLog','/envioMails.mailsEnviadosLog/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    // Se guardaran las listas de contactos: Quien las creo, quienes tienen acceso (los usuarios tambien tendran un _id de listas para buscar mas rapido)
    name: 'ListasCreadas',
    collectionName: 'envioMails.listasCreadas',
    url: '/envioMails.listasCreadas/:_id',
    params: {
        _id: '@_id'
    },
    actions:{
        list:{
            urls: ['/envioMails.listasCreadas'],
            kind: 'find'
        },
        findById:{
            kind: 'findOne'
        },
        save:{
            urls: ['/envioMails.listasCreadas','/envioMails.listasCreadas/:_id'],
            kind: 'findAndModify'
        },
        delete:{
            kind: 'remove'
        }
    }
}];