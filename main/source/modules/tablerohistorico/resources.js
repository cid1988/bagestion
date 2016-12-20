exports = module.exports = [{
    name: 'Relevamiento',
    collectionName: 'relevamientos',
    url: '/relevamientos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/relevamientos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/relevamientos', '/relevamientos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}, {
    name: 'Hito',
    collectionName: 'hitos',
    url: '/hitos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/hitos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/hitos', '/hitos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];