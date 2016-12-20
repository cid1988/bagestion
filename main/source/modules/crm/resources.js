exports = module.exports = [{
    name: 'CRMContacto',
    collectionName: 'crm.contactos',
    url: '/crm.contactos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/crm.contactos'],
            allowed: ['crm'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/crm.contactos','/crm.contactos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'CRMReporte',
    collectionName: 'crm.reportes',
    url: '/crm.reportes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/crm.reportes'],
            allowed: ['crm'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/crm.reportes','/crm.reportes/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];