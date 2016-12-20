exports = module.exports = [{
    name: 'SeguimientoMetrobus',
    collectionName: 'seguimientoMetrobus',
    url: '/seguimientoMetrobus/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/seguimientoMetrobus'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/seguimientoMetrobus','/seguimientoMetrobus/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];