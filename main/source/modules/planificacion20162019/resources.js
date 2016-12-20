exports = module.exports = [{
    name: 'Planificacion20162019',
    collectionName: 'planificacion20162019',
    url: '/planificacion20162019/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/planificacion20162019'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/planificacion20162019','/planificacion20162019/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EjePlanificacion20162019',
    collectionName: 'planificacion20162019.ejes',
    url: '/planificacion20162019.ejes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/planificacion20162019.ejes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/planificacion20162019.ejes','/planificacion20162019.ejes/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EstrategiaPlanificacion20162019',
    collectionName: 'planificacion20162019.estrategias',
    url: '/planificacion20162019.estrategias/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/planificacion20162019.estrategias'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/planificacion20162019.estrategias','/planificacion20162019.estrategias/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'AreaPlanificacion20162019',
    collectionName: 'planificacion20162019.areas',
    url: '/planificacion20162019.areas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/planificacion20162019.areas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/planificacion20162019.areas','/planificacion20162019.areas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];