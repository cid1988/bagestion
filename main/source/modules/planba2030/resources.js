exports = module.exports = [{
    name: 'PlanBA2030',
    collectionName: 'planba2030',
    url: '/planba2030/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/planba2030'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/planba2030','/planba2030/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EjePlanBA2030',
    collectionName: 'planba2030.ejes',
    url: '/planba2030.ejes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/planba2030.ejes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/planba2030.ejes','/planba2030.ejes/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EstrategiaPlanBA2030',
    collectionName: 'planba2030.estrategias',
    url: '/planba2030.estrategias/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/planba2030.estrategias'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/planba2030.estrategias','/planba2030.estrategias/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];