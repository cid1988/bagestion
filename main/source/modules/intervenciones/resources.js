exports = module.exports = [{
    name: 'Intervencion',
    collectionName: 'intervenciones',
    url: '/intervenciones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/intervenciones'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/intervenciones','/intervenciones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];