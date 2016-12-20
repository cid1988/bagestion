exports = module.exports = function(app, conf) {
    var doAll = function(db, res, nombresJurisdicciones, nombresImpactos, nombresMinisteriales, nombresOperativos, nombresDependencias) {
        
        var jurisdiccionPorId = function(id) {
            for (var i = 0; i < nombresJurisdicciones.length; i++) {
                if (nombresJurisdicciones[i]._id == id) {
                    return nombresJurisdicciones[i];
                }
            }
        };
        
        var dependenciaPorId = function(id) {
            for (var i = 0; i < nombresDependencias.length; i++) {
                if (nombresDependencias[i]._id == id) {
                    return nombresDependencias[i];
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
        
        var ministerialPorId = function(id) {
            for (var i = 0; i < nombresMinisteriales.length; i++) {
                if (nombresMinisteriales[i]._id == id) {
                    return nombresMinisteriales[i];
                }
            }
        };
        
        var operativoPorId = function(id) {
            for (var i = 0; i < nombresOperativos.length; i++) {
                if (nombresOperativos[i]._id == id) {
                    return nombresOperativos[i];
                }
            }
        };

        var all = [
            ["Objetivo de Impacto", "Objetivo Ministerial", "Objetivo Operativo", "Jurisdiccion", "Dependencia", "Cod. Identificacion", "Proyecto", "Prioridad", "Descripcion Proyecto", "Meta Producto", "Meta Cuantificacion", "Población Objetivo", "Presupuesto Solicitado", "Fecha Inicio", "Fecha Fin", "Etapa Proyecto", "Prioridad Ministerial", "Presupuesto Gestión"]
        ];
        db.collection('poa.proyectos').find({
            $and:[{eliminado: {$exists:false}},
            {idPlan: new mongo.ObjectID("568c0be419c0870019758307")}]
          }).each(function(err, item) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }

            if (item) {
                all.push([
                    item.idObjImpacto && impactoPorId(item.idObjImpacto.valueOf().toString()) && impactoPorId(item.idObjImpacto.valueOf().toString()).nombre, 
                    item.idObjMinisterial && ministerialPorId(item.idObjMinisterial.valueOf().toString()) && ministerialPorId(item.idObjMinisterial.valueOf().toString()).nombre, 
                    item.idObjOperativo && operativoPorId(item.idObjOperativo.valueOf().toString()) && operativoPorId(item.idObjOperativo.valueOf().toString()).nombre, 
                    item.idJurisdiccion && jurisdiccionPorId(item.idJurisdiccion.valueOf().toString()) && jurisdiccionPorId(item.idJurisdiccion.valueOf().toString()).nombre, 
                    item.dependencia && dependenciaPorId(item.dependencia) && dependenciaPorId(item.dependencia).nombreCompleto, 
                    item.codIdentificacion,
                    item.nombre, 
                    item.prioridadJefatura, 
                    item.descripcion && item.descripcion.replace(/\r\n|\n|\r/g, " "),
                    item.metaProducto, 
                    item.metaCuantificacion,
                    item.poblacionObjetivo,
                    item.presupuestoSolicitado,
                    item.fechaInicio, 
                    item.fechaFin,
                    item.etapaProyecto,
                    item.prioridadMinisterial,
                    item.presupuestoGestion]);
            }
            else {
                res.setHeader("Content-Disposition", "attachment; filename=\"poa-proyectos.csv\"");
                res.csv(all);
            }
        });
    };
    
    require('express-csv');
    var mongo = require('mongodb');
    
    var doHitos = function (db, res, jurisdicciones, nombreProyectos){
         
         var jurisdiccionPorId = function(id) {
            for (var i = 0; i < jurisdicciones.length; i++) {
                if (jurisdicciones[i]._id == id) {
                    return jurisdicciones[i];
               }
            }
        };
         
         var proyectosPorId = function (id){
            for(var i = 0; i < nombreProyectos.length; i++){
               if (nombreProyectos[i]._id == id){
                  return nombreProyectos[i];
               }
            }
         };
         
         
         
         var all = [['Jurisdicción', 'Cod. Id', 'Nombre Proyecto', 'Nombre Hito', 'Fecha Inicio', 'Fecha Fin', 'Comentarios']];
         
         db.collection('poa.actividades').find({
            eliminado: {$exists:false}
         }).each(function(err, item) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }

            if (item) {
                all.push([
                   //jurisdiccion
                    item.idJurisdiccion && jurisdiccionPorId(item.idJurisdiccion.valueOf().toString()) && jurisdiccionPorId(item.idJurisdiccion.valueOf().toString()).nombre, 
                    //cod. id,
                    item.idProyecto && proyectosPorId(item.idProyecto.valueOf().toString()) && proyectosPorId(item.idProyecto.valueOf().toString()).codIdentificacion,
                    //nombre proyecto
                    item.idProyecto && proyectosPorId(item.idProyecto.valueOf().toString()) && proyectosPorId(item.idProyecto.valueOf().toString()).nombre,
                    //hito
                    item.nombre,
                    //fechas
                    item.fechas && item.fechas[item.fechas.length-1] && item.fechas[item.fechas.length-1].fechaInicio,
                    item.fechas && item.fechas[item.fechas.length-1] && item.fechas[item.fechas.length-1].fechaFin,
                    //comentarios
                    item.fechas && item.fechas[item.fechas.length-1] && item.fechas[item.fechas.length-1].comentario
                    ]);
                    
            }
            else {
                res.setHeader("Content-Disposition", "attachment; filename=\"poahitos.csv\"");
                res.csv(all);
            }
        });
    };
         
       
    
    app.get('/api/poaproyectos-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            db.collection('poa.jurisdicciones').find({}).toArray(function(err, nombresJurisdicciones) {
                db.collection('poa.objsImpacto').find({}).toArray(function(err, nombresImpactos) {
                    db.collection('poa.objsMinisteriales').find({}).toArray(function(err, nombresMinisteriales) {
                        db.collection('poa.objsOperativos').find({}).toArray(function(err, nombresOperativos) {
                            db.collection('orm.organigrama').find({}).toArray(function(err, nombresDependencias) {
                                doAll(db, res, nombresJurisdicciones, nombresImpactos, nombresMinisteriales, nombresOperativos, nombresDependencias);  
                            });  
                        });
                    });
                });
            });
        });
    });
    app.get('/api/tablaGeneral-csv/download/:plan', function(req, res) {
        var anio = req.params.plan;
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }


            
            db.collection('poa.jurisdicciones').find({}).toArray(function(err, jurisdicciones) {
                db.collection('poa.proyectos').find({}).toArray(function(err,proyectos){
                    doTodos(db, res, jurisdicciones, proyectos);  
                });
            });
            
            var doTodos=function(db, res, jurisdicciones, proyectos)
            {
                var all = [ ["Jurisdicción", "Cantidad proyectos", "Completos", "Incompletos"] ];
                var totalProyectos=0,totalCompletos=0;
                for(var i=0; i<jurisdicciones.length; i++)
                {
                    var contadorTotal=0, contadorCompletos=0;
                    if(!jurisdicciones[i].eliminado)
                    {
                        for(var x=0; x<proyectos.length; x++)
                        {
                            if(!proyectos[x].eliminado && proyectos[x].anio==anio)
                            {
                                if(proyectos[x].idJurisdiccion.valueOf().toString()==jurisdicciones[i]._id.valueOf().toString())
                                {
                                    contadorTotal++;
                                    if((proyectos[x].metaProducto) && (proyectos[x].metaProducto!="N/A") && (proyectos[x].metaCuantificacion) && (proyectos[x].fechaInicio) && (proyectos[x].fechaFin) && (proyectos[x].presupuestoSolicitado))
                                    {
                                        contadorCompletos++;
                                    }
                                }
                                
                            }
                        }
                        all.push([jurisdicciones[i].nombre,contadorTotal,contadorCompletos,(contadorTotal-contadorCompletos)]);
                        totalProyectos+=contadorTotal;
                        totalCompletos+=contadorCompletos;
                    }
                }
                
                all.push(["Total",totalProyectos,totalCompletos,totalProyectos-totalCompletos]);
                res.setHeader("Content-Disposition", "attachment; filename=\"poa-proyectos.csv\"");
                res.csv(all);
                
            };
            
        });
    });
    
    app.get('/api/poahitos-csv/download',function(req, res){
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            db.collection('poa.jurisdicciones').find({}).toArray(function(err, jurisdicciones) {
               db.collection('poa.proyectos').find({
               $and:[{eliminado: {$exists:false}},
               {idPlan: new mongo.ObjectID("568c0be419c0870019758307")}] //PLAN 2016
               }).toArray(function(err, nombreProyectos){
                  doHitos(db, res, jurisdicciones, nombreProyectos);
               });
            });
        });
    });
};