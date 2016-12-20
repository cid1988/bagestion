exports = module.exports = [{
    name: 'BajoAutopista',
    collectionName: 'bajoautopista',
    url: '/bajoautopista/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/bajoautopista'],
            allowed: ['bajoautopista'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/bajoautopista','/bajoautopista/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];