exports = module.exports = function(app, conf) {
    app.post('/api/usig/consultar-smp', function(req, res) {
       var smp = req.body.smp,
           url = 'http://inventario.usig.buenosaires.gob.ar/publico/getParcelaFichaTecnica/?callback=&smp=' + smp,
           request = require('request');

       request({
           url: url,
       }, function(err, res2, body) {
           if (err) {
               console.error(err);
               res.status(418);
               return res.end();
           }
           
           try {
               var json = body.slice(1, body.length - 1),
                   data = JSON.parse(json);

                // ejemplo: http://inventario.usig.buenosaires.gob.ar/publico/getParcelaFichaTecnica/?callback=&smp=45-091A-007
                
                // {"info": {"info_alfanumerica": {"superficie_total": "181.0000", "vuc": "0.1100", "frente": "9.8400", "fondo": "18.4000", "fuente": {"fechaActualizacion": "Mayo 2008", "proveedor": "Agencia de Ingresos Publicos"}, "pisos_bajo_rasante": 0, "pisos_sobre_rasante": 0, "unidades": 0, "prophoriz": "no"}, "id": 550831}}

               res.json(data);
           }
           catch (e) {
               console.error(e);
               res.status(418);
               res.end();
           }
       });
    });
   
   
    require('express-csv');
    app.get('/api/regularizacionDominial-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }

            var all = [
                ["Denominación", "Numero", "Tipo", "UTIU", "Polígono de calles", "Barrio", "Comuna", "Población", "Superficie", "Manzanas", "Parcelas", "Lote/Viv./UF", "Estado", "Origen", "Gestion - Proyecto", "Gestion - Descripcion Meta", "Gestion - Cantidad", "Gestion - Unidad", "Gestion - Jurisdiccion", "Gestion - Inicio" - "Gestion - Fin", "No Consolidado - Población", "No Consolidado - Poblacion %", "No Consolidado - Superficie", "No Consolidado - Manzanas", "No Consolidado - Parcelas", "No Consolidado - Lote/Viv./UF", "Consolidado - Población", "Consolidado - Poblacion %", "Consolidado - Superficie", "Consolidado - Manzanas", "Consolidado - Parcelas", "Consolidado - Lote/Viv./UF", "Vivienda Social - Población", "Vivienda Social - Poblacion %", "Vivienda Social - Superficie", "Vivienda Social - Manzanas", "Vivienda Social - Parcelas", "Vivienda Social - Lote/Viv./UF", "En Proceso de Regularización - Población", "En Proceso de Regularización - Poblacion %", "En Proceso de Regularización - Superficie", "En Proceso de Regularización - Manzanas", "En Proceso de Regularización - Parcelas", "En Proceso de Regularización - Lote/Viv./UF", "Regularizado - Población", "Regularizado - Poblacion %", "Regularizado - Superficie", "Regularizado - Manzanas", "Regularizado - Parcelas", "Regularizado - Lote/Viv./UF", "Judicial", "Plan Urbanización", "Regularización", "Infraestructura", "Dominio", "Responsable Regularización", "Social", "Relocalización", "Fuente"]
            ];
            db.collection('regularizacionDominial').find({}).sort({'prioridad':-1,'utiu':1,'denominacion':1}).each(function(err, item) {
                if (err) {
                    res.status(503);
                    console.log(err);
                    return res.end();
                }

                if (item) {
                    all.push([
                        item.denominacion, 
                        item.numero, 
                        item.tipo,
                        item.utiu,
                        item.poligonoCalles && item.poligonoCalles[0], 
                        item.barrio, 
                        item.comuna, 
                        item.poblacion, 
                        item.superficie, 
                        item.manzanas, 
                        item.parcelas, 
                        item.lote, 
                        item.estado, 
                        item.origen, 
                        
                        item.hicimos && item.hicimos[0].proyecto,
                        item.hicimos && item.hicimos[0].descripcionMeta,
                        item.hicimos && item.hicimos[0].cantidad,
                        item.hicimos && item.hicimos[0].unidad,
                        item.hicimos && item.hicimos[0].jurisdiccion,
                        item.hicimos && item.hicimos[0].fechaInicio,
                        item.hicimos && item.hicimos[0].fechaFin,
                        
                        item.poblacionNC, 
                        item.poblacionPorNC, 
                        item.superficieNC, 
                        item.manzanasNC, 
                        item.parcelasNC, 
                        item.loteNC, 
                        item.poblacionC, 
                        item.poblacionPorC, 
                        item.superficieC, 
                        item.manzanasC, 
                        item.parcelasC, 
                        item.loteC, 
                        item.poblacionVS, 
                        item.poblacionPorVS, 
                        item.superficieVS, 
                        item.manzanasVS, 
                        item.parcelasVS, 
                        item.loteVS,
                        item.poblacionPR, 
                        item.poblacionPorPR, 
                        item.superficiePR, 
                        item.manzanasPR, 
                        item.parcelasPR, 
                        item.lotePR,
                        item.poblacionR, 
                        item.poblacionPorR, 
                        item.superficieR, 
                        item.manzanasR, 
                        item.parcelasR, 
                        item.loteR,
                        item.judicial && "Si" || "No", 
                        item.planUrbanizacion && "Si" || "No", 
                        item.regularizacion && "Si" || "No", 
                        item.infraestructura, 
                        item.dominio, 
                        item.regularizacionTexto, 
                        item.social,
                        item.relocalizacion, 
                        item.fuente
                    ]);
                    if (item.hicimos) {
                        if (item.hicimos.length > 1) {
                            for (var i = 1; i < item.hicimos.length-1; i++) {
                                all.push([
                                    "", 
                                    "", 
                                    "",
                                    "",
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    
                                    item.hicimos && item.hicimos[i].proyecto,
                                    item.hicimos && item.hicimos[i].descripcionMeta,
                                    item.hicimos && item.hicimos[i].cantidad,
                                    item.hicimos && item.hicimos[i].unidad,
                                    item.hicimos && item.hicimos[i].jurisdiccion,
                                    item.hicimos && item.hicimos[i].fechaInicio,
                                    item.hicimos && item.hicimos[i].fechaFin,
                                    
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "",
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "",
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                    "", 
                                ]);
                            }
                        }
                    }
                }
                else {
                    res.setHeader("Content-Disposition", "attachment; filename=\"regularizacionDominial.csv\"");
                    res.csv(all);
                }
            });
        });
    });
};
