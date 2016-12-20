exports = module.exports = [{
    name: 'Lista',
    collectionName: 'listas',
    url: '/listas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/listas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/listas','/listas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];