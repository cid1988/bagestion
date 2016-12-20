exports = module.exports = [{
    name: 'Iniciativa',
    collectionName: 'iniciativas',
    url: '/iniciativas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas','/iniciativas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EstadoIniciativa',
    collectionName: 'iniciativas.estados',
    url: '/iniciativas.estados/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.estados'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.estados','/iniciativas.estados/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ClaseIniciativa',
    collectionName: 'iniciativas.clases',
    url: '/iniciativas.clases/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.clases'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.clases','/iniciativas.clases/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'TipoIniciativa',
    collectionName: 'iniciativas.tipos',
    url: '/iniciativas.tipos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.tipos'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.tipos','/iniciativas.tipos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'AlcanceIniciativa',
    collectionName: 'iniciativas.alcances',
    url: '/iniciativas.alcances/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.alcances'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.alcances','/iniciativas.alcances/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'IniciativaPlan',
    collectionName: 'iniciativas.planes',
    url: '/iniciativas.planes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.planes'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.planes','/iniciativas.planes/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'RelevanciaIniciativa',
    collectionName: 'iniciativas.relevancias',
    url: '/iniciativas.relevancias/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.relevancias'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.relevancias','/iniciativas.relevancias/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'MonedaIniciativa',
    collectionName: 'iniciativas.monedas',
    url: '/iniciativas.monedas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.monedas'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.monedas','/iniciativas.monedas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'CriticidadIniciativa',
    collectionName: 'iniciativas.criticidades',
    url: '/iniciativas.criticidades/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.criticidades'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.criticidades','/iniciativas.criticidades/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'FuenteFinanciacionIniciativa',
    collectionName: 'iniciativas.fuentes',
    url: '/iniciativas.fuentes/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.fuentes'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.fuentes','/iniciativas.fuentes/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SegmentoEtarioIniciativa',
    collectionName: 'iniciativas.segmentos',
    url: '/iniciativas.segmentos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.segmentos'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.segmentos','/iniciativas.segmentos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'GrupoIniciativa',
    collectionName: 'iniciativas.grupos',
    url: '/iniciativas.grupos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.grupos'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.grupos','/iniciativas.grupos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ImpactoIniciativa',
    collectionName: 'iniciativas.impactos',
    url: '/iniciativas.impactos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.impactos'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.impactos','/iniciativas.impactos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'OrdenIniciativa',
    collectionName: 'iniciativas.orden1',
    url: '/iniciativas.orden1/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.orden1'],
            allowed: ['iniciativas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/iniciativas.orden1','/iniciativas.orden1/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];