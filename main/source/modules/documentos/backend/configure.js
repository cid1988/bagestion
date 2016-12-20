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
   
   
   
   var doAll = function(db, res, nombresComunas, nombresJurisdicciones) {

        var comunaPorId = function(id) {
            for (var i = 0; i < nombresComunas.length; i++) {
                if (nombresComunas[i]._id == id) {
                    return nombresComunas[i];
                }
            }
        };

        var jurisdiccionPorId = function(id) {
            for (var i = 0; i < nombresJurisdicciones.length; i++) {
                if (nombresJurisdicciones[i]._id == id) {
                    return nombresJurisdicciones[i];
                }
            }
        };

        var parcelas = function(array) {
            var todas = "";
            for (var i = 0; i < array.length; i++) {
                if (array[i]) {
                    if (array[i].parcela) {
                        todas = todas + array[i].parcela;
                        if ((array.length - 1) != i) {
                            todas = todas + " - ";
                        }
                    }
                }
            }
            return todas;
        };

        var all = [
            ["Comuna", "ID Mapa", "Predio", "Calle", "Desde", "Hasta", "Usuario", "USO", "Destino", "Ocupación", "Status", "Inicio", "Fin", "Canon", "Uso Actual", "Plan de Acción", "Fecha", "Responsable", "Sección", "Manzana", "Parcelas", "Superficie Total", "Superficie Cubierta", "FOT"]
        ];
        db.collection('bajoautopista').find({}).each(function(err, item) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }

            if (item) {
                all.push([
                item.comuna && comunaPorId(item.comuna) && comunaPorId(item.comuna).nombre,
                item.idMapa,
                item.predio,
                item.calle,
                item.entre1,
                item.entre2,
                item.usuario,
                item.uso,
                item.destino,
                item.ocupacion,
                item.status,
                item.fechaInicio,
                item.fechaFin,
                item.canon,
                item.usoActual,
                item.planAccion,
                item.fecha,
                item.responsable && jurisdiccionPorId(item.responsable) && jurisdiccionPorId(item.responsable).nombreCompleto,
                item.smp && item.smp[0] && item.smp[0].seccion,
                item.smp && item.smp[0] && item.smp[0].manzana,
                item.smp && item.smp[0] && item.smp[0].parcela && parcelas(item.smp),
                item.superficieTotal,
                item.superficieCubierta,
                item.fot]);
            }
            else {
                res.setHeader("Content-Disposition", "attachment; filename=\"bajoautopista.csv\"");
                res.csv(all);
            }
        });
    };

    require('express-csv');
    app.get('/api/bajoautopista-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }

            db.collection('orm.organigrama').find({}).toArray(function(err, nombresJurisdicciones) {

                db.collection('comunas').find({}).toArray(function(err, nombresComunas) {
                    doAll(db, res, nombresComunas, nombresJurisdicciones);
                });
            });

        });
    });
};