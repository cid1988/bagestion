exports = module.exports = [{
    name: 'Agenda',
    collectionName: 'agendas',
    url: '/agendas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/agendas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/agendas','/agendas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}
,{
    name: 'AgendaInstancia',
    collectionName: 'agendas.instancias',
    url: '/agendas.instancias/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/agendas.instancias'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/agendas.instancias','/agendas.instancias/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}
,{
    name: 'AgendaMinuta',
    collectionName: 'agendas.minutas',
    url: '/agendas.minutas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/agendas.minutas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/agendas.minutas','/agendas.minutas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'AgendaTemario',
    collectionName: 'agendas.temarios',
    url: '/agendas.temarios/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/agendas.temarios'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/agendas.temarios','/agendas.temarios/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];