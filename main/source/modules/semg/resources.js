exports = module.exports = [{
    name: 'SEMGIndicador',
    collectionName: 'semg.indicadores',
    url: '/semg.indicadores/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.indicadores'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.indicadores','/semg.indicadores/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGMonitoreo',
    collectionName: 'semg.monitoreos',
    url: '/semg.monitoreos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.monitoreos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.monitoreos','/semg.monitoreos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGMonitoreo',
    collectionName: 'semg.monitoreos',
    url: '/semg.monitoreos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.monitoreos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.monitoreos','/semg.monitoreos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGEvaluacion',
    collectionName: 'semg.evaluaciones',
    url: '/semg.evaluaciones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.evaluaciones'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.evaluaciones','/semg.evaluaciones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGPlanDesarrollo',
    collectionName: 'semg.plandesarrollo',
    url: '/semg.plandesarrollo/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.plandesarrollo'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.plandesarrollo','/semg.plandesarrollo/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGPlanSistematizacion',
    collectionName: 'semg.plansistematizacion',
    url: '/semg.plansistematizacion/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.plansistematizacion'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.plansistematizacion','/semg.plansistematizacion/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGPlanDesarrolloCC',
    collectionName: 'semg.plandesarrollocc',
    url: '/semg.plandesarrollocc/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.plandesarrollocc'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.plandesarrollocc','/semg.plandesarrollocc/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGPlanSistematizacionCC',
    collectionName: 'semg.plansistematizacioncc',
    url: '/semg.plansistematizacioncc/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.plansistematizacioncc'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.plansistematizacioncc','/semg.plansistematizacioncc/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGCartaCompromiso',
    collectionName: 'semg.cartacompromisos',
    url: '/semg.cartacompromisos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.cartacompromisos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.cartacompromisos','/semg.cartacompromisos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGCCMonitoreo',
    collectionName: 'semg.ccmonitoreos',
    url: '/semg.ccmonitoreos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.ccmonitoreos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.ccmonitoreos','/semg.ccmonitoreos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGCCEvaluacion',
    collectionName: 'semg.ccevaluaciones',
    url: '/semg.ccevaluaciones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.ccevaluaciones'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.ccevaluaciones','/semg.ccevaluaciones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGMetrica',
    collectionName: 'semg.metricas',
    url: '/semg.metricas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.metricas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.metricas','/semg.metricas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGCompromisos',
    collectionName: 'semg.compromisos',
    url: '/semg.compromisos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.compromisos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.compromisos','/semg.compromisos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGTemas',
    collectionName: 'semg.temas',
    url: '/semg.temas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.temas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.temas','/semg.temas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGTablaGeneralJurisIndicadores',
    collectionName: 'semg.tablaGeneralJurisIndicadores',
    url: '/semg.tablaGeneralJurisIndicadores/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.tablaGeneralJurisIndicadores'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.tablaGeneralJurisIndicadores','/semg.tablaGeneralJurisIndicadores/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'SEMGMatrizMonitoreo',
    collectionName: 'semg.matrizMonitoreo',
    url: '/semg.matrizMonitoreo/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/semg.matrizMonitoreo'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/semg.matrizMonitoreo','/semg.matrizMonitoreo/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];