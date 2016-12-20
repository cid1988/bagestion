exports = module.exports = function(app, conf) {
    require('express-csv');
    app.get('/api/crucesFerroviarios-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }

            var all = [
                ["Calle", "Altura", "Dependencia", "Proyecto", "Comuna", "Estado", "Fecha finalizacion", "Inaugurada", "Monto", "Conclusion", "Avance"]
            ];
            db.collection('crucesFerroviarios').find({}).each(function(err, item) {
                if (err) {
                    res.status(503);
                    console.log(err);
                    return res.end();
                }

                if (item) {
                    all.push([item.calle, item.altura, item.dependencia, item.proyecto, item.comuna, item.estado, item.fecha_finaliza, item.inaugurada, item.monto, item.conclusion, item.avance]);
                }
                else {
                    res.setHeader("Content-Disposition", "attachment; filename=\"crucesFerroviarios.csv\"");
                    res.csv(all);
                }
            });
        });
    });
};
