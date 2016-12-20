exports = module.exports = [{
    name: 'Edg',
    collectionName: 'edg',
    url: '/edg/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/edg'],
            allowed: ['edg'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/edg','/edg/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EdgPresupuestoSigaf',
    collectionName: 'edg.presupuestoSigaf',
    url: '/edg.presupuestoSigaf/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/edg.presupuestoSigaf'],
            allowed: ['edg'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/edg.presupuestoSigaf','/edg.presupuestoSigaf/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];