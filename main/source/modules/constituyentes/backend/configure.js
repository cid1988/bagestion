exports = module.exports = function(app, conf) {
    require('express-csv');
    app.get('/api/constituyentes-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }

            var all = [
                ["Calle", "Altura", "Piso", "Departamento", "Estado", "Situacion", "Traspaso a AUSA", "Otras alturas", "Circunscripcion", "Seccion", "Manzana", "Parcela", "Cantidad de parcelas", "Unidad funcional", "Tipo", "Vivienda"]
            ];
            db.collection('constituyentes').find({}).each(function(err, item) {
                if (err) {
                    res.status(503);
                    console.log(err);
                    return res.end();
                }

                if (item) {
                    all.push([item.calle, item.altura, item.piso, item.departamento, item.estado, item.situacion, item.trasp_ausa, item.otras_alturas, item.circunscripcion, item.seccion, item.manzana, item.parcela, item.cant_parcelas, item.unidad_funcional, item.tipo, item.vivienda]);
                }
                else {
                    res.setHeader("Content-Disposition", "attachment; filename=\"constituyentes.csv\"");
                    res.csv(all);
                }
            });
        });
    });
};
