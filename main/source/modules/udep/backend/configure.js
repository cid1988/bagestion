exports = module.exports = function(app, conf) {
    
    // configurar la api para enviar mails
    require('./email.js')(app, conf);
    
    var doAll = function(db, res, nombres, nombresUdep) {
        
        var jurisdiccionPorId = function(id) {
            for (var i = 0; i < nombres.length; i++) {
                if (nombres[i]._id == id) {
                    return nombres[i];
                }
            }
        };
        
        var udepPorId=function(id)
        {
            for(var i=0; i<nombresUdep.length; i++)
            {
                if (nombresUdep[i]._id==id)
                {
                    return nombresUdep[i];
                }
            }
        };
        
        var all = [
            ["ID del programa", "Nombre del programa", "Jurisdicción", "Nombre usuario", "Mail usuarios", "Fecha visita", "% de carga", "Cantidad de actividades", "Cantidad de productos", "Cantidad de resultados del programa", "Cantidad de impactos a largo plazo", "Campos vacios / incompletos" ]
        ];
        db.collection('udepReportes').find({}).sort({idPrograma:1}).each(function(err, item) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            if (item) {
                all.push([
                    item.idPrograma && item.idPrograma,
                    item.idPrograma && udepPorId(item.idPrograma) && udepPorId(item.idPrograma).nombreDelPrograma,
                    item.idPrograma && udepPorId(item.idPrograma) && udepPorId(item.idPrograma).jurisdiccion &&  jurisdiccionPorId(udepPorId(item.idPrograma).jurisdiccion) && jurisdiccionPorId(udepPorId(item.idPrograma).jurisdiccion).nombreCompleto,
                    item.usuario && item.usuario,
                    item.usuario && item.usuario+"@buenosaires.gob.ar",
                    item.fecha && item.fecha,
                    item.porcentajeCarga && item.porcentajeCarga,
                    item.cantidadActividades && item.cantidadActividades,
                    item.cantidadProductos && item.cantidadProductos,
                    item.cantidadResultados && item.cantidadResultados,
                    item.cantidadImpactos && item.cantidadImpactos,
                    item.porcentajeCarga && (32-(Math.floor((((item.porcentajeCarga)*32)/100)))),
                ]);
            }
            else {
                res.setHeader("Content-Disposition", "attachment; filename=\"udep.csv\"");
                res.csv(all);
            }
        });
    };
    
    require('express-csv');
    app.get('/api/udep-Csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            db.collection('orm.organigrama').find({}).toArray(function(err, nombreJurisdiccion) {
                db.collection('udep').find({}).toArray(function(err, nombreUdep) {
                    doAll(db, res, nombreJurisdiccion, nombreUdep);
                });
            });
        });
    });
};