exports = module.exports = [{
    name: 'Constituyentes',
    collectionName: 'constituyentes',
    url: '/constituyentes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/constituyentes'],
            allowed: ['constituyentes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/constituyentes','/constituyentes/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SituacionConstituyentes',
    collectionName: 'constituyentes.situaciones',
    url: '/constituyentes.situaciones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/constituyentes.situaciones'],
            allowed: ['constituyentes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/constituyentes.situaciones','/constituyentes.situaciones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EstadoConstituyentes',
    collectionName: 'constituyentes.estados',
    url: '/constituyentes.estados/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/constituyentes.estados'],
            allowed: ['constituyentes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/constituyentes.estados','/constituyentes.estados/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'TipoConstituyentes',
    collectionName: 'constituyentes.tipos',
    url: '/constituyentes.tipos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/constituyentes.tipos'],
            allowed: ['constituyentes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/constituyentes.tipos','/constituyentes.tipos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EstadisticasConstituyentes',
    collectionName: 'constituyentes.estadisticas',
    url: '/constituyentes.estadisticas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/constituyentes.estadisticas'],
            allowed: ['constituyentes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/constituyentes.estadisticas','/constituyentes.estadisticas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];