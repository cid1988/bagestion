exports = module.exports = [{
    name: 'CorteCalzada',
    collectionName: 'cortescalzadas',
    url: '/cortescalzadas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/cortescalzadas'],
            allowed: ['cortescalzadas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/cortescalzadas','/cortescalzadas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'CorteCalzadaCompromiso',
    collectionName: 'cortescalzadas.compromisos',
    url: '/cortescalzadas.compromisos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/cortescalzadas.compromisos'],
            allowed: ['cortescalzadas'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/cortescalzadas.compromisos','/cortescalzadas.compromisos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];