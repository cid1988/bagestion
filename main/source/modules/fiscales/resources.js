exports = module.exports = [{
    name: 'Fiscal',
    collectionName: 'fiscales',
    url: '/fiscales/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/fiscales'],
            allowed: ['fiscales'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/fiscales','/fiscales/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EventoFiscal',
    collectionName: 'eventosfiscal',
    url: '/eventosfiscal/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/eventosfiscal'],
            allowed: ['fiscales'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/eventosfiscal','/eventosfiscal/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];