exports = module.exports = function(app, conf) {
    require('express-csv');
    app.get('/api/curriculumBA-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }

            var all = [
                ["Nombre", "Apellido", "Sexo", "Fecha de Nacimiento", "Tipo Documento", "Nº Documento", "Teléfono fijo", "Telefono celular", "E-mail", "Estado Civil", "Domicilio", "Ciudad", "Provincia", "Nacionalidad", "Código Postal", "Conocimientos Adicionales", "Informe/s sobre entrevista/s"]
            ];
            db.collection('rhResumeTool').find({}).each(function(err, item) {
                if (err) {
                    res.status(503);
                    console.log(err);
                    return res.end();
                }

                if (item) {
                    all.push([item.nombre, item.apellido, item.sexo, item.fechaNacimiento, item.tipo, item.documento, item.numeroTelefono, item.numeroCelular, item.email, item.estadoCivil, item.domicilio, item.ciudad, item.provincia, item.nacionalidad, item.codigoPostal, item.otrasExperiencias, item.infoEntrevistas]);
                }
                else {
                    res.setHeader("Content-Disposition", "attachment; filename=\"curriculumBA.csv\"");
                    res.csv(all);
                }
            });
        });
    });
};
