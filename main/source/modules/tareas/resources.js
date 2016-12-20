exports = module.exports = [{
    name: 'Tarea',
    collectionName: 'tareas',
    url: '/tareas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/tareas'],
            allowed: ['tareas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/tareas','/tareas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},
{
    name: 'TareaGrupo',
    collectionName: 'tareas.grupos',
    url: '/tareas.grupos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/tareas.grupos'],
            allowed: ['tareas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/tareas.grupos','/tareas.grupos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];