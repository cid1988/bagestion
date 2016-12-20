exports = module.exports = [{
    name: 'Fact',
    collectionName: 'facts',
    url: '/facts/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/facts'],
            allowed: ['facts'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/facts','/facts/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];