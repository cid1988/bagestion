exports = module.exports = [{
    name: 'CruceFerroviario',
    collectionName: 'crucesFerroviarios',
    url: '/crucesFerroviarios/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/crucesFerroviarios'],
            allowed: ['crucesFerroviarios'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/crucesFerroviarios','/crucesFerroviarios/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EstadoCrucesFerroviarios',
    collectionName: 'crucesFerroviarios.estados',
    url: '/crucesFerroviarios.estados/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/crucesFerroviarios.estados'],
            allowed: ['crucesFerroviarios'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/crucesFerroviarios.estados','/crucesFerroviarios.estados/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'FFCCCrucesFerroviarios',
    collectionName: 'crucesFerroviarios.ffcc',
    url: '/crucesFerroviarios.ffcc/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/crucesFerroviarios.ffcc'],
            allowed: ['crucesFerroviarios'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/crucesFerroviarios.ffcc','/crucesFerroviarios.ffcc/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'AnioCrucesFerroviarios',
    collectionName: 'crucesFerroviarios.anios',
    url: '/crucesFerroviarios.anios/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/crucesFerroviarios.anios'],
            allowed: ['crucesFerroviarios'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/crucesFerroviarios.anios','/crucesFerroviarios.anios/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];