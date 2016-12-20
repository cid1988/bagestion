exports = module.exports = [{
    name: 'Comuna',
    collectionName: 'comunas',
    url: '/comunas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/comunas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/comunas','/comunas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];