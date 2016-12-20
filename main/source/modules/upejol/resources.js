exports = module.exports = [{
    name: 'AreasUPEJOL',
    collectionName: 'upejol.areas',
    url: '/upejol.areas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/upejol.areas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/upejol.areas','/upejol.areas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EjeUPEJOL',
    collectionName: 'upejol.ejes',
    url: '/upejol.ejes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/upejol.ejes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/upejol.ejes','/upejol.ejes/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'PlanesUPEJOL',
    collectionName: 'upejol.planes',
    url: '/upejol.planes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/upejol.planes'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/upejol.planes','/upejol.planes/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ObjAreaUPEJOL',
    collectionName: 'upejol.objsArea',
    url: '/upejol.objsArea/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/upejol.objsArea'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/upejol.objsArea','/upejol.objsArea/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ActividadesUPEJOL',
    collectionName: 'upejol.actividades',
    url: '/upejol.actividades/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/upejol.actividades'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/upejol.actividades','/upejol.actividades/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'HitosUPEJOL',
    collectionName: 'upejol.hitos',
    url: '/upejol.hitos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/upejol.hitos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/upejol.hitos','/upejol.hitos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'PlanAnualUPEJOL',
    collectionName: 'upejol.planesAnuales',
    url: '/upejol.planesAnuales/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/upejol.planesAnuales'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/upejol.planesAnuales','/upejol.planesAnuales/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'HistorialUPEJOL',
    collectionName: 'upejol.historial',
    url: '/upejol.historial/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/upejol.historial'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/upejol.historial','/upejol.historial/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EtiquetaUPEJOL',
    collectionName: 'upejol.etiquetas',
    url: '/upejol.etiquetas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/upejol.etiquetas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/upejol.etiquetas','/upejol.etiquetas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'RequerimientoUPEJOL',
    collectionName: 'upejol.requerimientos',
    url: '/upejol.requerimientos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/upejol.requerimientos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/upejol.requerimientos','/upejol.requerimientos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'FormasDePagoUPEJOL',
    collectionName: 'upejol.formasdepago',
    url: '/upejol.formasdepago/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/upejol.formasdepago'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/upejol.formasdepago','/upejol.formasdepago/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];
