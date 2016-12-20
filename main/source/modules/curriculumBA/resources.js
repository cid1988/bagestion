exports = module.exports = [{
    name: 'RHResumeTool',
    collectionName: 'rhResumeTool',
    url: '/rhResumeTool/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/rhResumeTool'],
            allowed: ['rhResumeTool'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/rhResumeTool','/rhResumeTool/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];