exports = module.exports = [{
    name: 'SalasReuniones',
    collectionName: 'salasreuniones',
    url: '/salasreuniones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/salasreuniones'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/salasreuniones','/salasreuniones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}
,{
    name: 'SalasReunionesInstancia',
    collectionName: 'salasreuniones.instancias',
    url: '/salasreuniones.instancias/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/salasreuniones.instancias'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/salasreuniones.instancias','/salasreuniones.instancias/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];