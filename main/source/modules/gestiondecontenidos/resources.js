exports = module.exports = [{
    name: 'GestionDeContenidos',
    collectionName: 'gestiondecontenidos',
    url: '/gestiondecontenidos/:_id',
    params: 
    {
        _id: '@_id'
    },
    actions: 
    {
        list: 
        {
            urls: ['/gestiondecontenidos'],
            kind: 'find'
        },
        findById: 
        {
            kind: 'findOne'
        },
        save: 
        {
            urls: ['/gestiondecontenidos','/gestiondecontenidos/:_id'],
            kind: 'findAndModify'
        },
        delete: 
        {
            kind: 'remove'
        }
    }
},
{
    name: 'GestionDeContenidosAdministracion',
    collectionName: 'gestiondecontenidos.administracion',
    url: '/gestiondecontenidos.administracion/:_id',
    params: 
    {
        _id: '@_id'
    },
    actions: 
    {
        list: 
        {
            urls: ['/gestiondecontenidos.administracion'],
            kind: 'find'
        },
        findById: 
        {
            kind: 'findOne'
        },
        save: 
        {
            urls: ['/gestiondecontenidos.administracion','/gestiondecontenidos.administracion/:_id'],
            kind: 'findAndModify'
        },
        delete: 
        {
            kind: 'remove'
        }
    }
},
{
    name: 'Correos',
    collectionName: 'correos',
    url: '/correos/:_id',
    params: 
    {
        _id: '@_id'
    },
    actions: 
    {
        list: 
        {
            urls: ['/correos'],
            kind: 'find'
        },
        findById: 
        {
            kind: 'findOne'
        },
        save: 
        {
            urls: ['/correos','/correos/:_id'],
            kind: 'findAndModify'
        },
        delete: 
        {
            kind: 'remove'
        }
    }
}];