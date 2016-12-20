exports = module.exports = function(app, conf) {
    var doAll = function(db, res, nombresJurisdicciones, nombresIniciativas) {
        
        var jurisdiccionPorId = function(id) {
            for (var i = 0; i < nombresJurisdicciones.length; i++) {
                if (nombresJurisdicciones[i]._id == id) {
                    return nombresJurisdicciones[i];
                }
            }
        };
        
        var iniciativaPorId = function(id) {
            for (var i = 0; i < nombresIniciativas.length; i++) {
                if (nombresIniciativas[i]._id == id) {
                    return nombresIniciativas[i];
                }
            }
        };

        var all = [
            ["AREA", "NUMERO", "INICIATIVA", "FECHA", "COMPROMISOS Y PROXIMOS PASOS", "STATUS", "AVANCES", "SEGUIMIENTO ESPECIAL"]
        ];
        db.collection('planificacion20162019.areas').find({}).each(function(err, item) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            if (item) {
                if (item.compromisos) {
                    for (var i = 0; i < item.compromisos.length; i++) {
                        all.push([
                            item.jurisdiccion && jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).nombreCompleto,
                            "",
                            item.compromisos[i].iniciativa && iniciativaPorId(item.compromisos[i].iniciativa) && iniciativaPorId(item.compromisos[i].iniciativa).nombreProyecto,
                            "",
                            item.compromisos[i].compromisos && item.compromisos[i].compromisos.replace(/\r\n|\n|\r/g, " "),
                            "",
                            item.compromisos[i].avances && item.compromisos[i].avances.replace(/\r\n|\n|\r/g, " "),
                            "" 
                        ]);
                    }
                }
            }
        });
        db.collection('planificacion20162019').find({}).each(function(err, item) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            if (item) {
                if (item.compromisos) {
                    for (var i = 0; i < item.compromisos.length; i++) {
                        all.push([
                            item.areaResponsable && item.areaResponsable[0] && jurisdiccionPorId(item.areaResponsable[0]) && jurisdiccionPorId(item.areaResponsable[0]).nombreCompleto,
                            item.compromisos[i].numero,
                            item.nombreProyecto,
                            item.compromisos[i].fecha,
                            item.compromisos[i].compromisos && item.compromisos[i].compromisos.replace(/\r\n|\n|\r/g, " "),
                            item.compromisos[i].status,
                            "",
                            item.compromisos[i].star 
                        ]);
                    }
                }
            }
            else {
                res.setHeader("Content-Disposition", "attachment; filename=\"compromisos.csv\"");
                res.csv(all);
            }
        });
    };
    
    require('express-csv');
    app.get('/api/compromisos1619-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            db.collection('planificacion20162019').find({}).toArray(function(err, nombresIniciativas) {
                db.collection('orm.organigrama').find({}).toArray(function(err, nombresJurisdicciones) {
                    nombresJurisdicciones.push({
                        _id : "zzz01",
                        nombreCompleto : "Proyectos Público Privados"
                    });
                    nombresJurisdicciones.push({
                        _id : "zzz02",
                        nombreCompleto : "Otros Proyectos"
                    });
                    nombresJurisdicciones.push({
                        _id : "zzz03",
                        nombreCompleto : "Villa 31"
                    });
                    nombresJurisdicciones.push({
                        _id : "zzz04",
                        nombreCompleto : "Policía Metropolitana"
                    });
                    nombresJurisdicciones.push({
                        _id : "zzz05",
                        nombreCompleto : "BA Caminable"
                    });
                    nombresJurisdicciones.push({
                        _id : "zzz06",
                        nombreCompleto : "Proyectos en evaluación"
                    });
                    nombresJurisdicciones.push({
                        _id : "zzz07",
                        nombreCompleto : "Urbanización Villa 31"
                    });
                    nombresJurisdicciones.push({
                        _id : "zzz08",
                        nombreCompleto : "Temas aún no encarados"
                    });
                    doAll(db, res, nombresJurisdicciones, nombresIniciativas);
                                                            
                });
            });
        });
    });
};