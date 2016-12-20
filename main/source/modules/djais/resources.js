exports = module.exports = [{
    name: 'DJAI',
    collectionName: 'djais',
    url: '/djais/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/djais'],
            allowed: ['djais'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/djais','/djais/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];