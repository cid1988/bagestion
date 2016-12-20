exports = module.exports = [{
    name: 'Pregunta',
    collectionName: 'legislatura',
    url: '/legislatura/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/legislatura'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/legislatura','/legislatura/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'CuestionarioLegislatura',
    collectionName: 'legislatura.cuestionarios',
    url: '/legislatura.cuestionarios/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/legislatura.cuestionarios'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/legislatura.cuestionarios','/legislatura.cuestionarios/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EventoPregunta',
    collectionName: 'legislatura.eventos',
    url: '/legislatura.eventos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/legislatura.eventos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/legislatura.eventos','/legislatura.eventos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EjeTematicoPregunta',
    collectionName: 'legislatura.ejesTematicos',
    url: '/legislatura.ejesTematicos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/legislatura.ejesTematicos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/legislatura.ejesTematicos','/legislatura.ejesTematicos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'TematicaPregunta',
    collectionName: 'legislatura.tematicas',
    url: '/legislatura.tematicas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/legislatura.tematicas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/legislatura.tematicas','/legislatura.tematicas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EstadoPregunta',
    collectionName: 'legislatura.estadosPregunta',
    url: '/legislatura.estadosPregunta/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/legislatura.estadosPregunta'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/legislatura.estadosPregunta','/legislatura.estadosPregunta/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'BloquePregunta',
    collectionName: 'legislatura.bloques',
    url: '/legislatura.bloques/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/legislatura.bloques'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/legislatura.bloques','/legislatura.bloques/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'TemaPregunta',
    collectionName: 'legislatura.temas',
    url: '/legislatura.temas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/legislatura.temas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/legislatura.temas','/legislatura.temas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'Trazabilidad',
    collectionName: 'legislatura.trazabilidades',
    url: '/legislatura.trazabilidades/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/legislatura.trazabilidades'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/legislatura.trazabilidades','/legislatura.trazabilidades/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];