exports = module.exports = [{
    name: 'Estacionamiento',
    collectionName: 'estacionamiento',
    url: '/estacionamiento/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/estacionamiento'],
            allowed: ['estacionamiento'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/estacionamiento','/estacionamiento/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}
,{
    name: 'EstacionamientoInstancia',
    collectionName: 'estacionamiento.instancias',
    url: '/estacionamiento.instancias/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/estacionamiento.instancias'],
            allowed: ['estacionamiento'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/estacionamiento.instancias','/estacionamiento.instancias/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];