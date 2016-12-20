exports = module.exports = [{
    name: 'Funcionario',
    collectionName: 'funcionarios',
    url: '/funcionarios/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/funcionarios'],
            allowed: ['funcionarios'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/funcionarios','/funcionarios/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];