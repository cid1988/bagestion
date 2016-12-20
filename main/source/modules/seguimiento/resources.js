exports = module.exports = [{
    name: 'ExpedienteSeguimiento',
    collectionName: 'seguimiento.expedientes',
    url: '/seguimiento.expedientes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/seguimiento.expedientes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/seguimiento.expedientes','/seguimiento.expedientes/:_id'],
            kind: 'findAndModify',
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ExpedientesConfig',
    collectionName: 'seguimiento.expedientesConfig',
    url: '/seguimiento.expedientesConfig/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/seguimiento.expedientesConfig'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/seguimiento.expedientesConfig','/seguimiento.expedientesConfig/:_id'],
            kind: 'findAndModify',
        },
        delete: {
            kind: 'remove'
        }
    }
}];