exports = module.exports = [{
    name: 'ORMTema',
    collectionName: 'orm.temas',
    url: '/orm.temas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.temas'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.temas','/orm.temas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'FuenteTema',
    collectionName: 'temas.fuentes',
    url: '/temas.fuentes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/temas.fuentes'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/temas.fuentes','/temas.fuentes/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];