exports = module.exports = [{
    name: 'JurisdiccionesAnterior',
    collectionName: 'poa.jurisdicciones_anterior',
    url: '/poa.jurisdicciones_anterior/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.jurisdicciones_anterior'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.jurisdicciones_anterior','/poa.jurisdicciones_anterior/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'PlanesAnterior',
    collectionName: 'poa.planes_anterior',
    url: '/poa.planes_anterior/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.planes_anterior'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.planes_anterior','/poa.planes_anterior/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ObjImpactoAnterior',
    collectionName: 'poa.objsImpacto_anterior',
    url: '/poa.objsImpacto_anterior/:_id',
//    checkUserDbPerm: 'poa',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.objsImpacto_anterior'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.objsImpacto_anterior','/poa.objsImpacto_anterior/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ObjMinisterialesAnterior',
    collectionName: 'poa.objsMinisteriales_anterior',
    url: '/poa.objsMinisteriales_anterior/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.objsMinisteriales_anterior'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.objsMinisteriales_anterior','/poa.objsMinisteriales_anterior/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ObjOperativosAnterior',
    collectionName: 'poa.objsOperativos_anterior',
    url: '/poa.objsOperativos_anterior/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.objsOperativos_anterior'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.objsOperativos_anterior','/poa.objsOperativos_anterior/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ProyectosAnterior',
    collectionName: 'poa.proyectos_anterior',
    url: '/poa.proyectos_anterior/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.proyectos_anterior'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.proyectos_anterior','/poa.proyectos_anterior/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'HitosActividadesAnterior',
    collectionName: 'poa.actividades_anterior',
    url: '/poa.actividades_anterior/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.actividades_anterior'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.actividades_anterior','/poa.actividades_anterior/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];
