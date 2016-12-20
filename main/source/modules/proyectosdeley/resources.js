exports = module.exports = [{
    name: 'Proyectosdeley',
    collectionName: 'proyectosDeLey',
    url: '/proyectosDeLey/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/proyectosDeLey'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/proyectosDeLey','/proyectosDeLey/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'Comisiones',
    collectionName: 'proyectosDeLey.comisiones',
    url: '/proyectosDeLey.comisiones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/proyectosDeLey.comisiones'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/proyectosDeLey.comisiones','/proyectosDeLey.comisiones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'Grupos',
    collectionName: 'proyectosDeLey.grupos',
    url: '/proyectosDeLey.grupos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/proyectosDeLey.grupos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/proyectosDeLey.grupos','/proyectosDeLey.grupos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];