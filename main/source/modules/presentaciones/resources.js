exports = module.exports = [{
    name: 'Presentacion',
    collectionName: 'presentaciones',
    url: '/presentaciones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/presentaciones'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/presentaciones','/presentaciones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];