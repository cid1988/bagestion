exports = module.exports = [{
    name: 'Obras2',
    collectionName: 'obras2',
    url: '/obras2/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/obras2'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/obras2','/obras2/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'Obra',
    collectionName: 'obras',
    url: '/obras/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/obras'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/obras','/obras/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'EstadoObra',
    collectionName: 'iniciativas.estados',
    url: '/iniciativas.estados/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.estados'],
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
    name: 'ClaseObra',
    collectionName: 'iniciativas.clases',
    url: '/iniciativas.clases/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.clases'],
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
    name: 'TipoObra',
    collectionName: 'obras.tipos',
    url: '/obras.tipos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/obras.tipos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/obras.tipos','/obras.tipos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},/*{
    name: 'TipoObra',
    collectionName: 'iniciativas.tipos',
    url: '/iniciativas.tipos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.tipos'],
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
},*/{
    name: 'SubtiposObra',
    collectionName: 'obras.subtipos',
    url: '/obras.subtipos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/obras.subtipos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/obras.subtipos','/obras.subtipos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'GrupoObra',
    collectionName: 'iniciativas.grupos',
    url: '/iniciativas.grupos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.grupos'],
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
    name: 'ImpactoObra',
    collectionName: 'iniciativas.impactos',
    url: '/iniciativas.impactos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.impactos'],
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
    name: 'OrdenObra',
    collectionName: 'iniciativas.orden1',
    url: '/iniciativas.orden1/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/iniciativas.orden1'],
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
},{
    name: 'Presentaciones',
    collectionName: 'obras.presentaciones',
    url: '/obras.presentaciones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/obras.presentaciones'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/obras.presentaciones','/obras.presentaciones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'PresentacionesPdf',
    collectionName: 'obras.presentacionesPdf',
    url: '/obras.presentacionesPdf/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/obras.presentacionesPdf'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/obras.presentacionesPdf','/obras.presentacionesPdf/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'Relevamientos',
    collectionName: 'obras.relevamientos',
    url: '/obras.relevamientos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/obras.relevamientos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/obras.relevamientos','/obras.relevamientos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ProveedoresObras',
    collectionName: 'obras.proveedores',
    url: '/obras.proveedores/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/obras.proveedores'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/obras.proveedores','/obras.proveedores/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'MapaAsi',
    collectionName: 'obras.mapaAsi',
    url: '/obras.mapaAsi/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/obras.mapaAsi'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/obras.mapaAsi','/obras.mapaAsi/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ImportExcel',
    collectionName: 'obras.importExcel',
    url: '/obras.importExcel/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/obras.importExcel'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/obras.importExcel','/obras.importExcel/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'MapaAsiFotos',
    collectionName: 'obras.mapaAsi.fotos',
    url: '/obras.mapaAsi.fotos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/obras.mapaAsi.fotos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/obras.mapaAsi.fotos','/obras.mapaAsi.fotos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];