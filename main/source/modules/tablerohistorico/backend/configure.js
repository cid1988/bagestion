exports = module.exports = function (app, conf) {
    app.get('/api/listaDependencias/:anio', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoDependencias').find({
                ID_Madre: 0,
                Mostrar_Index_web: 1,
                Dependencia_Ano_vigencia: Number(req.params.anio)
            }, function (err, cursor) {
                cursor.toArray(function (err, docs) {
                    if (err) {
                        console.log(err);
                        res.status(503);
                        res.end();
                    } else {
                        res.json(docs);
                    }
                });
            });
        });
    });

    app.get('/api/informesSyH/:idInforme', function (req, res){
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoSeguridadHigieneInformes').find({
                idInforme: Number(req.params.idInforme)
            })
            .toArray(function (err, docs) {
                if (err) {
                    console.log(err);
                    res.status(503);
                    res.end();
                } else {
                    res.json(docs);
                }
            });
        });
    });

    app.get('/api/informesSyHcatgoria/:categoria', function (req, res){
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoSeguridadHigieneEstructura').find({
                categoria: Number(req.params.categoria)
            })
            .toArray(function (err, docs) {
                if (err) {
                    console.log(err);
                    res.status(503);
                    res.end();
                } else {
                    var dict = {};
                    
                    docs.forEach(function (d) {
                        dict[d.idEstructura] = d;
                    });
                    
                    res.json(dict);
                }
            });
        });
    });

    app.get('/api/fotosRelevamiento/:relevamiento', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoRelevamientosImagenes').find({
                id_relevamiento: Number(req.params.relevamiento)
            })
            .toArray(function (err, docs) {
                if (err) {
                    console.log(err);
                    res.status(503);
                    res.end();
                } else {
                    res.json(docs);
                }
            });
        });
    });


    app.get('/api/documentosHitos/:hitoId', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoHitosDocumentos').find({
                id_hito: Number(req.params.hitoId)
            })
            .toArray(function (err, docs) {
                if (err) {
                    console.log(err);
                    res.status(503);
                    res.end();
                } else {
                    res.json(docs);
                }
            });
        });
    });

    app.get('/api/documentosProyecto/:proyecto', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoProyectosDocumentos').find({
                id_Proyecto: Number(req.params.proyecto)
            })
            .toArray(function (err, docs) {
                if (err) {
                    console.log(err);
                    res.status(503);
                    res.end();
                } else {
                    res.json(docs);
                }
            });
        });
    });

    app.get('/api/listaEstrategia/:dependencia', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoEstrategias').find({
                iddependencia: Number(req.params.dependencia)
            }, function (err, cursor) {
                cursor.toArray(function (err, docs) {
                    if (err) {
                        console.log(err);
                        res.status(503);
                        res.end();
                    } else {
                        res.json(docs);
                    }
                });
            });
        });
    });
    
    app.get('/api/listaObjetivo/:estrategia', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoObjetivos').find({
                ESTRATEGIAID: Number(req.params.estrategia)
            }, function (err, cursor) {
                cursor.toArray(function (err, docs) {
                    if (err) {
                        console.log(err);
                        res.status(503);
                        res.end();
                    } else {
                        res.json(docs);
                    }
                });
            });
        });
    });
    
    app.get('/api/listaProyectos/:objetivo', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoProyectos').find({
                idObjetivo: Number(req.params.objetivo)
            }, function (err, cursor) {
                cursor.toArray(function (err, docs) {
                    if (err) {
                        console.log(err);
                        res.status(503);
                        res.end();
                    } else {
                        res.json(docs);
                    }
                });
            });
        });
    });
    app.get('/api/proyecto/:proyecto', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoProyectos').findOne({
                ID: Number(req.params.proyecto)
            }, function (err, doc) {
                res.json(doc || {});
            });
        });
    });

    app.get('/api/fichaVirtual/:proyecto', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoRelevamientos').find({
                id_proyecto: Number(req.params.proyecto)
            }).toArray(function (err, docs) {
                res.json(docs || []);
            });
        });
    });

    app.get('/api/listaHitos/:proyecto', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoHitos').find({
                idProyecto: Number(req.params.proyecto)
            }, function (err, cursor) {
                cursor.toArray(function (err, docs) {
                    if (err) {
                        console.log(err);
                        res.status(503);
                        res.end();
                    } else {
                        res.json(docs);
                    }
                });
            });
        });
    });

    app.get('/api/listaPresupuesto/:proyecto', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoProyectoPresupuesto').find({
                idProyecto: req.params.proyecto
            }, function (err, cursor) {
                cursor.toArray(function (err, docs) {
                    if (err) {
                        console.log(err);
                        res.status(503);
                        res.end();
                    } else {
                        res.json(docs);
                    }
                });
            });
        });
    });
    
    app.get('/api/listaCgpc/:proyecto', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoProyectoCgp').find({
                id_proyecto: Number(req.params.proyecto)
            }, function (err, cursor) {
                cursor.toArray(function (err, docs) {
                    if (err) {
                        console.log(err);
                        res.status(503);
                        res.end();
                    } else {
                        res.json(docs);
                    }
                });
            });
        });
    });
    
    app.get('/api/informesSyHxRelevamiento/:idRelevamiento', function (req, res) {
        require('../../../db').getDbInstance(function (err, db) {
            db.collection('HistoricoSeguridadHigieneIdInformes').find({
                idRelevamiento: Number(req.params.idRelevamiento)
            }, function (err, cursor) {
                cursor.toArray(function (err, docs) {
                    if (err) {
                        console.log(err);
                        res.status(503);
                        res.end();
                    } else {
                        res.json(docs);
                    }
                });
            });
        });
    });
    
    app.get('/api/fotosRelevamiento/:imagen/imagen', function (req, res) {
        var docsPath = require('../config.json').docsPath;
        
        res.sendfile(require('path').join(docsPath, req.params.imagen));
    });
};
