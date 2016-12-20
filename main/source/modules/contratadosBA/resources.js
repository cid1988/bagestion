exports = module.exports = [{
    name: 'ContratadoBA',
    collectionName: 'contratadosBA',
    url: '/contratadosBA/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/contratadosBA'],
            allowed: ['contratadosBA'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/contratadosBA','/contratadosBA/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];