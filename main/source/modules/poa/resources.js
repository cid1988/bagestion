exports = module.exports = [{
    name: 'Jurisdicciones',
    collectionName: 'poa.jurisdicciones',
    url: '/poa.jurisdicciones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.jurisdicciones'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.jurisdicciones','/poa.jurisdicciones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EjePOA',
    collectionName: 'poa.ejes',
    url: '/poa.ejes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.ejes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.ejes','/poa.ejes/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'Planes',
    collectionName: 'poa.planes',
    url: '/poa.planes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.planes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.planes','/poa.planes/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ObjImpacto',
    collectionName: 'poa.objsImpacto',
    url: '/poa.objsImpacto/:_id',
//    checkUserDbPerm: 'poa',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.objsImpacto'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.objsImpacto','/poa.objsImpacto/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ObjMinisteriales',
    collectionName: 'poa.objsMinisteriales',
    url: '/poa.objsMinisteriales/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.objsMinisteriales'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.objsMinisteriales','/poa.objsMinisteriales/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ObjOperativos',
    collectionName: 'poa.objsOperativos',
    url: '/poa.objsOperativos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.objsOperativos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.objsOperativos','/poa.objsOperativos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'Proyectos',
    collectionName: 'poa.proyectos',
    url: '/poa.proyectos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.proyectos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.proyectos','/poa.proyectos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'PoaObras',
    collectionName: 'poa.obras',
    url: '/poa.obras/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.obras'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.obras','/poa.obras/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'HitosActividades',
    collectionName: 'poa.actividades',
    url: '/poa.actividades/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.actividades'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.actividades','/poa.actividades/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'PlanAnual',
    collectionName: 'poa.planesAnuales',
    url: '/poa.planesAnuales/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.planesAnuales'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.planesAnuales','/poa.planesAnuales/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'Historial',
    collectionName: 'poa.historial',
    url: '/poa.historial/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.historial'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.historial','/poa.historial/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'POAEtiqueta',
    collectionName: 'poa.etiquetas',
    url: '/poa.etiquetas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.etiquetas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.etiquetas','/poa.etiquetas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'POANotificacion',
    collectionName: 'poa.notificaciones',
    url: '/poa.notificaciones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/poa.notificaciones'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/poa.notificaciones','/poa.notificaciones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];
