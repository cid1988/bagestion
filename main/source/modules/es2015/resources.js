exports = module.exports = [{
    name: 'ES2015Distrito',
    collectionName: 'es2015.distritos',
    url: '/es2015.distritos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/es2015.distritos'],
            allowed: ['es2015'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/es2015.distritos','/es2015.distritos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ES2015Estructura',
    collectionName: 'es2015.estructuras',
    url: '/es2015.estructuras/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/es2015.estructuras'],
            allowed: ['es2015'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/es2015.estructuras','/es2015.estructuras/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ES2015Hito',
    collectionName: 'es2015.hitos',
    url: '/es2015.hitos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/es2015.hitos'],
            allowed: ['es2015'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/es2015.hitos','/es2015.hitos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];