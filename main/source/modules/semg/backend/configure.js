exports = module.exports = function(app, conf) {
    var doAll = function(db, res, nombresJurisdicciones, nombresProyectos, nombresImpactos, nombresMinisteriales, nombresCompromisos, nombresTemas) {

        var jurisdiccionPorId = function(id) {
            for (var i = 0; i < nombresJurisdicciones.length; i++) {
                if (nombresJurisdicciones[i]._id == id) {
                    return nombresJurisdicciones[i];
                }
            }
        };

        var proyectosPorId = function(id) {
               for (var i = 0; i < nombresProyectos.length; i++) {
                   if (nombresProyectos[i]._id == id) {
                       return nombresProyectos[i];
                   }
               }
        };

        var arrayProyectosPorId = function(array) {
            var valor = "";
            if (array && array.length) {
                for (var i = 0; i < array.length; i++) {
                    if (proyectosPorId(array[i])) {
                        valor = valor + proyectosPorId(array[i]).nombre;
                        if (i + 1 < array.length) {
                            valor = valor + ", ";
                        }
                    }
                }
            }
            return valor;
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

        var variacionMetaAnual = function(item){
           if ((item.metaAnio && item.metaAnio > 0) && (item.metaAnterior && item.metaAnterior > 0)){
              return ((item.metaAnio - item.metaAnterior)/item.metaAnterior * 100).toFixed(2);
           } else {
              return '';
           }
        };

        var compromisosPorId = function(id) {
           for (var i = 0; nombresCompromisos.length; i++){
              if (nombresCompromisos[i]._id == id){
                 return nombresCompromisos[i];
              }
           }
        };
        
        var temasPorId = function(id) {
           for (var i = 0; i < nombresTemas.length; i++){
              if (nombresTemas[i]._id == id){
                 return nombresTemas[i];
              }
           }
        };
        
        var arrayTemasPorId = function(array) {
           var temas = "";
           if (array) {
               for (var i = 0; i < array.length; i++) {
                   if (temasPorId(array[i])) {
                       temas = temas + temasPorId(array[i]).nombre;
                       if (i + 1 < array.length) {
                           temas = temas + ", ";
                       }
                   }
               }
           }
           return temas;
        };
        
        

        var all = [
            [
            //Objetivo
            "OBJETIVO DE IMPACTO",
            "OBJETIVO MINISTERIAL",
            
            //Indicador
            "NOMBRE DEL INDICADOR",
            "DESCRIPCIÓN DEL INDICADOR",
            "METODO DE CALCULO",
            "METRICA",
            "SENTIDO DEL INDICADOR",
            "FRECUENCIA",
            "FORMATO DE NUMERO",
            "PESO",
            "PROYECTOS",
            "LINEA BASE",
            
            //Desempeño
            "UNIDAD 2012",
            "UNIDAD 2013",
            "UNIDAD 2014",
            "UNIDAD 2015",
            "META 2015",
            "SEMAFORO VERDE",
            "SEMAFORO AMARRILLO",
            "SEMAFORO ROJO",
            "JUSTIFICACION DE LA META",
            "VARIACION INTERANUAL DE LAS METAS 2015/2016",
            
            //Fuente
            "FUENTE",
            "REFERENTE FUENTE",
            "SISTEMA DE RECOLECCION DE DATOS",
            "EJES",
            "COMPROMISOS",
            "TEMAS",
            "JURISDICCION",
            "AÑO"]
        ];
        db.collection('semg.indicadores').find({}).each(function(err, item) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            if (item) {
                all.push([
                   
                //Objetivo
                item.objetivoImpacto && impactoPorId(item.objetivoImpacto.valueOf().toString()) && impactoPorId(item.objetivoImpacto.valueOf().toString()).nombre || 'En blanco',
                item.objetivoMinisterial && ministerialPorId(item.objetivoMinisterial.valueOf().toString()) && ministerialPorId(item.objetivoMinisterial.valueOf().toString()).nombre || 'En blanco',
                
                //Indicador
                item.indicadorImpacto || 'En blanco',
                item.descripcionImpacto || 'En blanco',
                item.metodoCalculo || 'En blanco',
                item.metrica || 'En blanco',
                item.sentido || 'En blanco',
                item.frecuencia || 'En blanco',
                item.formatoNumero || 'En blanco',
                item.peso || 'En blanco',
                item.proyectos && arrayProyectosPorId(item.proyectos),
                item.lineaBase || 'En blanco',
                
                //Desempeño
                item.unidad4 || 'En blanco',
                item.unidad3 || 'En blanco',
                item.unidad2 || 'En blanco',
                item.unidad1 || 'En blanco',
                item.metaAnio || 'En blanco',
                item.semaforizacion && item.semaforizacion.rango1 || 'En blanco',
                item.semaforizacion && item.semaforizacion.rango2 || 'En blanco',
                item.semaforizacion && item.semaforizacion.rango3 || 'En blanco',
                item.justificacionMeta || 'En blanco',
                variacionMetaAnual(item),
                
                //Fuente
                item.fuenteInterna || item.fuenteExterna || 'En blanco',
                item.referenteFuente || 'En blanco',
                item.recoleccionDatos || 'En blanco',
                item.ejes || 'En blanco',
                item.compromiso && compromisosPorId(item.compromiso.valueOf().toString()) && compromisosPorId(item.compromiso.valueOf().toString()).nombre || 'En blanco',
                item.temas && arrayTemasPorId(item.temas),
                
                //Jurisdiccion y año
                item.dependencia && jurisdiccionPorId(item.dependencia) && jurisdiccionPorId(item.dependencia).nombreCompleto || 'En blanco',
                item.anio || 'En blanco' ]);
            }
            else {
                res.setHeader("Content-Disposition", "attachment; filename=\"indicadores.csv\"");
                res.csv(all);
            }
        });
    };
    
    var doAllCartas = function(db, res, nombresJurisdicciones) {
        var jurisdiccionPorId = function(id) {
            for (var i = 0; i < nombresJurisdicciones.length; i++) {
                if (nombresJurisdicciones[i]._id == id) {
                    return nombresJurisdicciones[i];
                }
            }
        };
        var all = [
            ["Jurisdicción", "Subsecretaría", "Dirección", "Servicios", "Servicio o Tramite", "Destinatario", "¿Cómo medimos la calidad?", "Unidad de medida", "Justificación", "Indicador", "Meta 2015", "Semestre 1", "Semestre 2", "Requerimientos para que el usuario pueda hacer uso del servicios o trámite", "Responsable", "Fuente de Información", "Año"]
        ];
        db.collection('semg.cartacompromisos').find({}).each(function(err, item) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            if (item) {
                if (item.compromisos) {
                    for (var i = 0; i < item.compromisos.length; i++) {
                        if (item.compromisos[i]) {
                            all.push([
                            item.jurisdiccion && jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).nombreCompleto || 'En blanco',
                            item.subsecretaria && jurisdiccionPorId(item.subsecretaria) && jurisdiccionPorId(item.subsecretaria).nombreCompleto || 'En blanco',
                            item.dependencia && jurisdiccionPorId(item.dependencia) && jurisdiccionPorId(item.dependencia).nombreCompleto || 'En blanco',
                            item.servicio || 'En blanco',
                            item.compromisos[i].serviciosTramites || 'En blanco',
                            item.compromisos[i].destinatario || 'En blanco',
                            item.compromisos[i].compromisoResultado || 'En blanco',
                            item.compromisos[i].medidaUnidad || 'En blanco',
                            item.compromisos[i].justificacion || 'En blanco',
                            item.compromisos[i].indicador || 'En blanco',
                            item.compromisos[i].metaAnio || 'En blanco',
                            item.compromisos[i].semestre1 || 'En blanco',
                            item.compromisos[i].semestre2 || 'En blanco',
                            item.compromisos[i].procedimiento || 'En blanco',
                            item.compromisos[i].responsable || 'En blanco',
                            item.compromisos[i].fuente] || 'En blanco',
                            item.anio || 'En blanco' );
                        }
                    }
                }
            } else {
                res.setHeader("Content-Disposition", "attachment; filename=\"cartascompromiso.csv\"");
                res.csv(all);
            }
        });
    };
    
   var armarAutoEvaluacion=function()
   {
      
   };
    
    require('express-csv');
    app.get('/api/indicadores-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            //acá estoy tocando
            db.collection('orm.organigrama').find({}).toArray(function(err, nombresJurisdicciones) {
               db.collection('poa.proyectos').find({}).toArray(function(err, nombresProyectos) {
                  db.collection('poa.objsImpacto').find({}).toArray(function(err, nombresImpactos){
                     db.collection('poa.objsMinisteriales').find({}).toArray(function(err, nombresMinisteriales){
                        db.collection('semg.compromisos').find({}).toArray(function(err, nombresCompromisos){
                           db.collection('semg.temas').find({}).toArray(function(err, nombresTemas){
                              doAll(db, res, nombresJurisdicciones, nombresProyectos, nombresImpactos, nombresMinisteriales, nombresCompromisos, nombresTemas);
                           });
                        });
                     });
                  });
               });
            });
         });
      });
    
    app.get('/api/cartas-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            db.collection('orm.organigrama').find({}).toArray(function(err, nombresJurisdicciones) {
                doAllCartas(db, res, nombresJurisdicciones);
                                                        
            });
        });
    });
    
    
    
    var guardarCSV = function(db, res, organigrama, indicadores){
        
        var dependenciaPorId = function(id) {
            for (var i = 0; i < organigrama.length; i++) {
                if (organigrama[i]._id == id) {
                    return organigrama[i];
                }
            }
        };
        var all= [
            ["Dependencia","Objetivo Impacto","Objetivo Ministerial","Nro","Indicador","Metrica","Meta 2015","Avance a los 6 meses","% Porcentaje de Cumplimiento", "Año"]
        ];
        var num = 0;
        
        db.collection('semg.indicadores').find({}).each(function(err, indicadores) {
            
            
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            if (indicadores) {
                if(indicadores.sentido == "Ascendente"){
                    all.push([
                        indicadores.dependencia && dependenciaPorId(indicadores.dependencia) && dependenciaPorId(indicadores.dependencia).nombreCompleto || 'En blanco',
                        indicadores.objetivoImpacto || 'En blanco',
                        indicadores.objetivoMinisterial || 'En blanco',
                        (num + 1) || 'En blanco',
                        indicadores.indicadorImpacto || 'En blanco',
                        indicadores.metrica || 'En blanco',
                        indicadores.metaAnio || 'En blanco',
                        indicadores.avance6meses || 'En blanco',
                        porcentajeV1(indicadores.metaAnio, indicadores.avance6meses) || '0',
                        indicadores.anio || 'En blanco'
                    ]);                            
                    num++;  
                }
                if(indicadores.sentido == "Descendente"){
                    all.push([
                        indicadores.dependencia && dependenciaPorId(indicadores.dependencia) && dependenciaPorId(indicadores.dependencia).nombreCompleto || 'En blanco',
                        indicadores.objetivoImpacto || 'En blanco',
                        indicadores.objetivoMinisterial || 'En blanco',
                        (num + 1) || 'En blanco',
                        indicadores.indicadorImpacto || 'En blanco',
                        indicadores.metrica || 'En blanco',
                        indicadores.metaAnio || 'En blanco',
                        indicadores.avance6meses || 'En blanco',
                        porcentajeV2(indicadores.metaAnio, indicadores.avance6meses) || '0',
                        indicadores.anio || 'En blanco'
                    ]);                            
                    num++;  
                }
            } else {
                res.setHeader("Content-Disposition", "attachment; filename=\"semg.csv\"");
                res.csv(all);
            }
        });
    };
    
    

    // PORCENTAJES
    
    var porcentajeAuto = function(meta, carga) {
      if ((meta == 0) || (meta == '0') || (carga == 0) || (carga =='0')) {
         return 0;
      } else {
         return Math.round(100/soloNumeros(meta)*soloNumeros(carga));
      }
   };
   
    var porcentajeV1 = function(meta, carga) {
       return Math.round(100/soloNumeros(meta)*soloNumeros(carga));
    };
    
    var porcentajeV2 = function(meta, carga) {
        if (soloNumeros(carga)<soloNumeros(meta)) {
            return (200-Math.round(100/soloNumeros(meta)*soloNumeros(carga)));
        } else {
            return (100-Math.round(100/soloNumeros(meta)*(soloNumeros(carga)-soloNumeros(meta))));
        }
    };
    
    // Solo números, toma un texto y saca $ , ',' , etc.
    var soloNumeros = function(cadenaAnalizar) {
        if (cadenaAnalizar) {
            var nuevoString = "";
            for (var i = 0; i< cadenaAnalizar.length; i++) {
                 var caracter = cadenaAnalizar.charAt(i);
                 if( caracter == "0" || caracter == "1" || caracter == "2" || caracter == "3" || caracter == "4" || caracter == "5" || caracter == "6" || caracter == "7" || caracter == "8" || caracter == "9") {
                    nuevoString = nuevoString + caracter;
                  }
                 if( caracter == ",") {
                    nuevoString = nuevoString + ".";
                  }
            }
            
            if(nuevoString == ""){
                nuevoString = 0;
            }
            return nuevoString;
        } else {
            return "0";
        }
    };

    
   require('express-csv');
   app.get('/api/semg-csv/download', function(req, res) {
      require('../../../db.js').setConf(conf);
      require('../../../db.js').getDbInstance(function(err, db) {
         if (err) {
            res.status(503);
            console.log(err);
            return res.end();
         }
         db.collection('orm.organigrama').find({}).toArray(function(err, organigrama) {
            guardarCSV(db,res, organigrama);
         });
      });
    });
   /* _________________________ */
   app.get('/api/semg-csv-cartasCompromiso/download', function(req, res){
      require('../../../db.js').setConf(conf);
      require('../../../db.js').getDbInstance(function(err, db) {
      
         if (err) {
            res.status(503);
            console.log(err);
            return res.end();
         }
         db.collection('orm.organigrama').find({}).toArray(function(err, listaOrganigrama){
            guardarCSVcartasCompromiso(db,res, listaOrganigrama);
         });
      });
   });
   
   var guardarCSVcartasCompromiso=function(db, res, listaOrganigrama){
      var jurisdiccionPorId = function(id) {
         for (var i = 0; i < listaOrganigrama.length; i++) {
            if (listaOrganigrama[i]._id == id) {
               return listaOrganigrama[i];
            }
         }
      };
      var dependenciaPorId = function(id) {
         for (var i = 0; i < listaOrganigrama.length; i++) {
            if (listaOrganigrama[i]._id == id) {
               return listaOrganigrama[i];
            }
         }
      };
        
      // Solo números, toma un texto y saca $ , ',' , etc.
      var soloNumeros = function(cadenaAnalizar) {
         if (cadenaAnalizar) {
            var nuevoString = "";
            for (var i = 0; i< cadenaAnalizar.length; i++) {
               var caracter = cadenaAnalizar.charAt(i);
               if( caracter == "0" || caracter == "1" || caracter == "2" || caracter == "3" || caracter == "4" || caracter == "5" || caracter == "6" || caracter == "7" || caracter == "8" || caracter == "9") {
                  nuevoString = nuevoString + caracter;
               }
               if( caracter == ",") {
                  nuevoString = nuevoString + ".";
               }
            }
            return nuevoString;
         } 
         else 
         {
            return "0";
         }
      };
        
      var all = [
         ["Jurisdición","Dependencia","Nro", "Servicio o Tramite","Compromiso Resultado","Medida Unidad","Meta 2015","Cumplimiento Semestre 1", "Cumplimiento Semestre 2", "Año"]
      ];
              
      db.collection('semg.cartacompromisos').find({}).each(function(err, item){
         if(item){
            if(item.compromisos){
               var porcentajeDesvioRespectoMeta;
               for(var x =0; x < item.compromisos.length ; x++){
                  if ((item.jurisdiccion=='5232029e2e9735061300001f') || (item.jurisdiccion=='522e177ae5fd3d320e000041') || (item.dependencia=='522e0594e5fd3d320e000027')) {
                     porcentajeDesvioRespectoMeta = Math.round((soloNumeros(item.compromisos[x].cumplimientoSemestre1)*100)/soloNumeros(item.compromisos[x].semestre1));
                  } 
                  else 
                  {
                     porcentajeDesvioRespectoMeta = Math.round((soloNumeros(item.compromisos[x].cumplimientoSemestre1)*100)/soloNumeros(item.compromisos[x].metaAnio));
                  }
                  all.push([
                     item.jurisdiccion &&  jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).nombreCompleto || 'En blanco',
                     item.dependencia && dependenciaPorId(item.dependencia) && dependenciaPorId(item.dependencia).nombreCompleto || 'En blanco',
                     (x+1) || 'En blanco',
                     item.compromisos[x].serviciosTramites || 'En blanco',
                     item.compromisos[x].compromisoResultado || 'En blanco',
                     item.compromisos[x].medidaUnidad || 'En blanco',
                     item.compromisos[x].metaAnio || 'En blanco',
                     item.compromisos[x].cumplimientoSemestre1 || 'En blanco',
                     item.compromisos[x].cumplimientoSemestre2 || 'En blanco',
                     item.anio || 'En blanco'
                  ]); 
               }
            }
         }
         else
         {
            res.setHeader("Content-Disposition", "attachment; filename=\"cartasCompromiso.csv\"");
            res.csv(all);
         }     
      });
   };
   
   /*__________________________ ACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC*/
   app.get('/api/semg-csv-autoevaluacion/download', function(req, res) {
      require('../../../db.js').setConf(conf);
      require('../../../db.js').getDbInstance(function(err, db) {
         
         if (err) {
            res.status(503);
            console.log(err);
            return res.end();
         }
         db.collection('orm.organigrama').find({}).toArray(function(err, listaOrganigrama){
            guardarCartasEnCSV(db,res, listaOrganigrama);
         });
          
      });
   });
   
   var guardarCSVAutoevaluacion = function(db, res, organigrama, indicadores){
      var dependenciaPorId = function(id) {
         for (var i = 0; i < organigrama.length; i++) {
            if (organigrama[i]._id == id) {
               return organigrama[i];
            }
         }
      };
      var all= [
         ["Dependencia","Objetivo Impacto","Objetivo Ministerial","Nro","Indicador","Metrica","Meta 2015","Avance a los 6 meses", "Cumplimiento a los 12 meses","% Porcentaje de Cumplimiento", "Año"]
      ];
      var num = 0;
        
      db.collection('semg.indicadores').find({}).each(function(err, indicadores) {
         if (err) {
            res.status(503);
            console.log(err);
            return res.end();
         }
         if (indicadores) 
         {
            if(indicadores.sentido == "Ascendente")
            {
               all.push([
                  indicadores.dependencia && dependenciaPorId(indicadores.dependencia) && dependenciaPorId(indicadores.dependencia).nombreCompleto || 'En blanco',
                  indicadores.objetivoImpacto || 'En blanco',
                  indicadores.objetivoMinisterial || 'En blanco',
                  (num + 1) || 'En blanco',
                  indicadores.indicadorImpacto || 'En blanco',
                  indicadores.metrica || 'En blanco',
                  indicadores.metaAnio || 'En blanco',
                  indicadores.avance6meses || 'En blanco',
                  indicadores.cumplimiento12meses || 'En blanco',
                  porcentajeAuto(indicadores.metaAnio, indicadores.cumplimiento12meses) || '0',
                  indicadores.anio || 'En blanco'
               ]);                            
               num++;  
            }
            if(indicadores.sentido == "Descendente"){
               all.push([
                  indicadores.dependencia && dependenciaPorId(indicadores.dependencia) && dependenciaPorId(indicadores.dependencia).nombreCompleto || 'En blanco',
                  indicadores.objetivoImpacto || 'En blanco',
                  indicadores.objetivoMinisterial || 'En blanco',
                  (num + 1) || 'En blanco',
                  indicadores.indicadorImpacto || 'En blanco',
                  indicadores.metrica || 'En blanco',
                  indicadores.metaAnio || 'En blanco',
                  indicadores.avance6meses || 'En blanco',
                  indicadores.cumplimiento12meses || 'En blanco',
                  porcentajeAuto(indicadores.metaAnio, indicadores.cumplimiento12meses) || '0',
                  indicadores.anio || 'En blanco'
               ]);                            
               num++;
            }
         } 
         else 
         {
            res.setHeader("Content-Disposition", "attachment; filename=\"semg.csv\"");
            res.csv(all);
         }
      });
   };

   /* _________________________ */
    
    require('express-csv');
    app.get('/api/cartasCompromiso/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            db.collection('orm.organigrama').find({}).toArray(function(err, listaOrganigrama){
                guardarCartasEnCSV(db,res, listaOrganigrama);
            });
             
        });
    });
    
    var guardarCartasEnCSV = function (db, res, listaOrganigrama){
        
        var jurisdiccionPorId = function(id) {
            for (var i = 0; i < listaOrganigrama.length; i++) {
                if (listaOrganigrama[i]._id == id) {
                    return listaOrganigrama[i];
                }
            }
        };
        var dependenciaPorId = function(id) {
            for (var i = 0; i < listaOrganigrama.length; i++) {
                if (listaOrganigrama[i]._id == id) {
                    return listaOrganigrama[i];
                }
            }
        };
        
        // Solo números, toma un texto y saca $ , ',' , etc.
        var soloNumeros = function(cadenaAnalizar) {
            if (cadenaAnalizar) {
                var nuevoString = "";
                for (var i = 0; i< cadenaAnalizar.length; i++) {
                     var caracter = cadenaAnalizar.charAt(i);
                     if( caracter == "0" || caracter == "1" || caracter == "2" || caracter == "3" || caracter == "4" || caracter == "5" || caracter == "6" || caracter == "7" || caracter == "8" || caracter == "9") {
                        nuevoString = nuevoString + caracter;
                      }
                     if( caracter == ",") {
                        nuevoString = nuevoString + ".";
                      }
                }
                return nuevoString;
            } else {
                return "0";
            }
        };
        
        var all = [
              ["Jurisdición","Dependencia","Nro", "Servicio o Tramite","Compromiso Resultado","Medida Unidad","Meta 2015","Porcentaje de Cumplimiento Semestre 1","Porcentaje de desvío respecto de la meta", "Año"]
         ];
              
        db.collection('semg.cartacompromisos').find({}).each(function(err, item){
            
            
                if(item){
                    if(item.compromisos){
                            var porcentajeDesvioRespectoMeta;
                            for(var x =0; x < item.compromisos.length ; x++){
                                if ((item.jurisdiccion=='5232029e2e9735061300001f') || (item.jurisdiccion=='522e177ae5fd3d320e000041') || (item.dependencia=='522e0594e5fd3d320e000027')) {
                                    porcentajeDesvioRespectoMeta = Math.round((soloNumeros(item.compromisos[x].cumplimientoSemestre1)*100)/soloNumeros(item.compromisos[x].semestre1));
                                } else {
                                    porcentajeDesvioRespectoMeta = Math.round((soloNumeros(item.compromisos[x].cumplimientoSemestre1)*100)/soloNumeros(item.compromisos[x].metaAnio));
                                }
                                all.push([
                                        item.jurisdiccion &&  jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).nombreCompleto || 'En blanco',
                                        item.dependencia && dependenciaPorId(item.dependencia) && dependenciaPorId(item.dependencia).nombreCompleto || 'En blanco',
                                        (x+1) || 'En blanco',
                                        item.compromisos[x].serviciosTramites || 'En blanco',
                                        item.compromisos[x].compromisoResultado || 'En blanco',
                                        item.compromisos[x].medidaUnidad || 'En blanco',
                                        item.compromisos[x].metaAnio || 'En blanco',
                                        item.compromisos[x].cumplimientoSemestre1 || 'En blanco',
                                        porcentajeDesvioRespectoMeta || '0',
                                        item.anio || 'En blanco'
                                    ]); 
                            }
                    }
                }else{
                    res.setHeader("Content-Disposition", "attachment; filename=\"cartasCompromiso.csv\"");
                    res.csv(all);
                }     
            
        });      
    };
    
};