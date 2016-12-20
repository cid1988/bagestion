exports = module.exports = [{
    name: 'IDG',
    collectionName: 'idg',
    url: '/idg/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/idg'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/idg','/idg/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];