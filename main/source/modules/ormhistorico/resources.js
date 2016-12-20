exports = module.exports = [{
    name: 'ORMReunionOld',
    collectionName: 'orm.reuniones_old',
    url: '/ormOld.reunionesOld/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/ormOld.reunionesOld'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/ormOld.reunionesOld','/ormOld.reunionesOld/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},
{
    name: 'ORMGrupoReunionOld',
    collectionName: 'orm.gruposreuniones_old',
    url: '/ormOld.gruposreunionesOld/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/ormOld.gruposreunionesOld'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/ormOld.gruposreunionesOld','/ormOld.gruposreunionesOld/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},
{
    name: 'ORMServiciosOld',
    collectionName: 'orm.servicios_old',
    url: '/ormOld.serviciosOld/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/ormOld.serviciosOld'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/ormOld.serviciosOld','/ormOld.serviciosOld/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ORMFechasEspecialesOld',
    collectionName: 'orm.fechasespeciales_old',
    url: '/ormOld.fechasespecialesOld/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/ormOld.fechasespecialesOld'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/ormOld.fechasespecialesOld','/ormOld.fechasespecialesOld/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ORMInstanciaReunionOld',
    collectionName: 'orm.reuniones.instancias_old',
    url: '/ormOld.reuniones.instanciasOld/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/ormOld.reuniones.instanciasOld'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/ormOld.reuniones.instanciasOld','/ormOld.reuniones.instanciasOld/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ORMTemarioOld',
    collectionName: 'orm.temarios_old',
    url: '/ormOld.temariosOld/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/ormOld.temariosOld'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/ormOld.temariosOld','/ormOld.temariosOld/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ORMMinutaOld',
    collectionName: 'orm.minutas_old',
    url: '/ormOld.minutasOld/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/ormOld.minutasOld'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/ormOld.minutasOld','/ormOld.minutasOld/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ORMCitaOld',
    collectionName: 'orm.citas_old',
    url: '/ormOld.citasOld/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/ormOld.citasOld'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/ormOld.citasOld','/ormOld.citasOld/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ORMTemaOld',
    collectionName: 'orm.temas_old',
    url: '/ormOld.temasOld/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/ormOld.temasOld'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/ormOld.temasOld','/ormOld.temasOld/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},
{
    name: 'ORMOrganigramaOld',
    collectionName: 'orm.organigrama_old',
    url: '/ormOld.organigramaOld/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/ormOld.organigramaOld'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/ormOld.organigramaOld','/ormOld.organigramaOld/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];