exports = module.exports = [{
    name: 'RegularizacionDominial',
    collectionName: 'regularizacionDominial',
    url: '/regularizacionDominial/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/regularizacionDominial'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/regularizacionDominial','/regularizacionDominial/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'TipoRegularizacionDominial',
    collectionName: 'regularizacionDominial.tipos',
    url: '/regularizacionDominial.tipos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/regularizacionDominial.tipos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/regularizacionDominial.tipos','/regularizacionDominial.tipos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'BarrioRegularizacionDominial',
    collectionName: 'regularizacionDominial.barrios',
    url: '/regularizacionDominial.barrios/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/regularizacionDominial.barrios'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/regularizacionDominial.barrios','/regularizacionDominial.barrios/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];