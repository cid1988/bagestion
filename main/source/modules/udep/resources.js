exports = module.exports = [{
    name: 'UDEP',
    collectionName: 'udep',
    url: '/udep/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/udep'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/udep','/udep/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},
{
    name: 'UDEPReportes',
    collectionName: 'udepReportes',
    url: '/udepReportes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/udepReportes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/udepReportes','/udepReportes/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];