exports = module.exports = function(app, conf) {
    var doAll = function(db,res,nombresComunas,nombresJurisdicciones,nombresReferentes,nombresImpactos,nombresReparticiones,nombresGrupos,nombresClases,nombresTipos,relevancias,alcances,criticidades,segmentosEtarios,nombresEstados,nombresPlanes) {
        
        var comunaPorId = function(id) {
            for (var i = 0; i < nombresComunas.length; i++) {
                if (nombresComunas[i]._id == id) {
                    return nombresComunas[i];
                }
            }
        };
        
        var arrayPorId = function(array) {
            var comunas = "";
            if (array) {
                for (var i = 0; i < array.length; i++) {
                    if (comunaPorId(array[i])) {
                        comunas = comunas + comunaPorId(array[i]).nombre;
                        if (i + 1 < array.length) {
                            comunas = comunas + ", ";
                        }
                    }
                }
            }
            return comunas;
        };
        
        var jurisdiccionPorId = function(id) {
            for (var i = 0; i < nombresJurisdicciones.length; i++) {
                if (nombresJurisdicciones[i]._id == id) {
                    return nombresJurisdicciones[i];
                }
            }
        };

        var grupoPorId = function(id) {
            for (var i = 0; i < nombresGrupos.length; i++) {
                if (nombresGrupos[i]._id == id) {
                    return nombresGrupos[i];
                }
            }
        };

        var clasePorId = function(id) {
            for (var i = 0; i < nombresClases.length; i++) {
                if (nombresClases[i]._id == id) {
                    return nombresClases[i];
                }
            }
        };

        var tipoPorId = function(id) {
            for (var i = 0; i < nombresTipos.length; i++) {
                if (nombresTipos[i]._id == id) {
                    return nombresTipos[i];
                }
            }
        };
        
        var impactoPorId = function(id) {
            for (var i = 0; i < nombresImpactos.length; i++) {
                if (nombresImpactos[i]._id == id) {
                    return nombresImpactos[i];
                }
            }
        };
        
        var contactoPorId = function(id) {
            for (var i = 0; i < nombresReferentes.length; i++) {
                if (nombresReferentes[i]) {
                    if (nombresReferentes[i]._id) {
                        if (nombresReferentes[i]._id == id) {
                            return nombresReferentes[i];
                        }
                    }
                }
            }
        };

        var reparticionPorId = function(id) {
            for (var i = 0; i < nombresReparticiones.length; i++) {
                if (nombresReparticiones[i]._id == id) {
                    return nombresReparticiones[i];
                }
            }
        };
    
        var relevanciaPorId = function (id) {
          for (var i = 0; i < relevancias.length; i++) {
              if (relevancias[i]._id == id)
              {
                  return relevancias[i];
              }
          }  
        };
        
        var alcancePorId = function (id) {
          for (var i = 0; i < alcances.length; i++) {
              if (alcances[i]._id == id)
              {
                  return alcances[i];
              }
          }  
        };
        
        var criticidadPorId = function (id) {
          for (var i = 0; i < criticidades.length; i++) {
              if (criticidades[i]._id == id)
              {
                  return criticidades[i];
              }
          }  
        };
        
        var segmentoPorId = function (id) {
          for (var i = 0; i < segmentosEtarios.length; i++) {
              if (segmentosEtarios[i]._id == id)
              {
                  return segmentosEtarios[i];
              }
          }  
        };
        
        var estadoPorId = function (id) {
            for (var i = 0; i < nombresEstados.length; i++) {
                if (nombresEstados[i]._id == id){
                    return nombresEstados[i];
                }
            }
        };
        
        var planPorId = function(id) {
            for (var i = 0; i < nombresPlanes.length; i++) {
                if (nombresPlanes[i]._id == id) {
                    return nombresPlanes[i];
                }
            }
        };
        
        var all = [
            ["Orden 1", "Orden 2", "Nombre Corto", "Nombre Largo", "ID", "Etapa", "Siglas", "Referencia de Mapa", "Plan", "Calle", "Altura", "Cruce", "Poligono Cargado", "Comuna", "Grupo", "Clase", "Tipo", "Impacto", "Jurisdicción", "Sigla de Jurisdicción", "Nombre Corto de Jurisdicción", "Dependencia", "Referente Ejecución", "Plazo Completo", "Previsto Para", "Metros Cuadrados", "Monto", "Relevancia", "Criticidad", "Alcance", "Segmento Etario", "Ciudadanos Afectados", "Detalle Comunicación", "Ubicacion Comunicación", "Estado"]
        ];
        db.collection('iniciativas').find({}).each(function(err, item) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            if (item) {
                all.push([
                item.orden1,
                item.orden2,
                item.nombre,
                item.nombre_largo,
                item._id,
                item.etapa,
                item.siglas,
                item.ref_mapa,
                item.plan && planPorId(item.plan) && planPorId(item.plan).nombre,
                item.calle,
                item.altura,
                item.cruce,
                item.direccionesMapa && item.direccionesMapa[0] && "Si",
                item.comuna && arrayPorId(item.comuna),
                item.grupo && grupoPorId(item.grupo) && grupoPorId(item.grupo).nombre,
                item.clase && clasePorId(item.clase) && clasePorId(item.clase).nombre,
                item.tipo && tipoPorId(item.tipo) && tipoPorId(item.tipo).nombre,
                item.impacto && impactoPorId(item.impacto) && impactoPorId(item.impacto).nombre,
                item.jurisdiccion && jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).nombre,
                item.jurisdiccion && jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).sigla,
                item.jurisdiccionNombreCorto,
                item.dependencia && reparticionPorId(item.dependencia) && reparticionPorId(item.dependencia).reparticion,
                item.referente && contactoPorId(item.referente) && contactoPorId(item.referente).apellidos,
                item.plazo_completo,
                item.previsto_para,
                item.metros,
                item.nombrar && item.nombrar[item.nombrar.length - 1] && item.nombrar[item.nombrar.length - 1].monto,
                item.relevancia && relevanciaPorId(item.relevancia) && relevanciaPorId(item.relevancia).nombre,
                item.criticidad && criticidadPorId(item.criticidad) && criticidadPorId(item.criticidad).nombre,
                item.alcance && alcancePorId(item.alcance) && alcancePorId(item.alcance).nombre,
                item.segmento_etario && segmentoPorId(item.segmento_etario) && segmentoPorId(item.segmento_etario).nombre,
                item.ciudadanos,
                item.detallesComunicacion && item.detallesComunicacion[item.detallesComunicacion.length - 1] && item.detallesComunicacion[item.detallesComunicacion.length - 1].detalle.replace(/\r\n|\n|\r/g, " "),
                item.ubicacionesComunicacion && item.ubicacionesComunicacion[item.ubicacionesComunicacion.length - 1] && item.ubicacionesComunicacion[item.ubicacionesComunicacion.length - 1].detalle.replace(/\r\n|\n|\r/g, " "),
                item.estado && estadoPorId(item.estado) && estadoPorId(item.estado).nombre]);
            }
            else {
                res.setHeader("Content-Disposition", "attachment; filename=\"iniciativas.csv\"");
                res.csv(all);
            }
        });
    };
    
    require('express-csv');
    app.get('/api/iniciativas-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            db.collection('jurisdicciones').find({}).toArray(function(err, nombresJurisdicciones){
                db.collection('comunas').find({}).toArray(function(err, nombresComunas){
                    db.collection('orm.contactos').find({}).toArray(function(err, nombresReferentes){
                        db.collection('iniciativas.clases').find({}).toArray(function(err, nombresClases){
                            db.collection('iniciativas.grupos').find({}).toArray(function(err, nombresGrupos){
                                db.collection('iniciativas.tipos').find({}).toArray(function(err, nombresTipos){
                                    db.collection('iniciativas.relevancias').find({}).toArray(function(err, relevancias){
                                        db.collection('iniciativas.alcances').find({}).toArray(function(err, alcances){
                                            db.collection('iniciativas.criticidades').find({}).toArray(function(err, criticidades){
                                                db.collection('iniciativas.segmentos').find({}).toArray(function(err, segmentosEtarios){
                                                    db.collection('iniciativas.impactos').find({}).toArray(function(err, nombresImpactos){
                                                        db.collection('funcionarios').find({}).toArray(function(err, nombresReparticiones){
                                                            db.collection('iniciativas.estados').find({}).toArray(function(err, nombresEstados){
                                                                db.collection('iniciativas.planes').find({}).toArray(function(err, nombresPlanes){
                                                                    doAll(db, res, nombresComunas, nombresJurisdicciones, nombresReferentes, nombresImpactos, nombresReparticiones, nombresGrupos, nombresClases, nombresTipos, relevancias, alcances, criticidades, segmentosEtarios, nombresEstados,nombresPlanes);
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};