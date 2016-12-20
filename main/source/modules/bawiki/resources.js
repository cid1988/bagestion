exports = module.exports = [{
    name: 'BAWiki',
    collectionName: 'baWiki',
    url: '/baWiki/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/baWiki'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/baWiki','/baWiki/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];