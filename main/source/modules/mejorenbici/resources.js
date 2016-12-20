exports = module.exports = [{
    name: 'MejorEnBici',
    collectionName: 'mejorenbici',
    url: '/mejorenbici/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/mejorenbici'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/mejorenbici','/mejorenbici/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}
,{
    name: 'MejorEnBiciInstancia',
    collectionName: 'mejorenbici.instancias',
    url: '/mejorenbici.instancias/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/mejorenbici.instancias'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/mejorenbici.instancias','/mejorenbici.instancias/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];