exports = module.exports = function(app, conf) 
{
    // configurar la api para enviar mails
    require('./email.js')(app, conf);

    // CSV de contactos
    require('express-csv');
    app.get('/api/testmapa-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            db.collection('testCalendario').find({}).toArray(function(err/*, nombresJurisdicciones*/) {

               
                var all = [
                    ["_id", 'Titulo', "Inicio", "Finalizacion", "color"]
                ];
                db.collection('testCalendario').find({}).each(function(err, item) {
                    if (err) {
                        res.status(503);
                        console.log(err);
                        return res.end();
                    }
    
                    if (item) {
                        all.push([item._id, item.title, item.start, item.end, item.color]);
                    }
                    else {
                        res.setHeader("Content-Disposition", "attachment; filename=\"contactos.csv\"");
                        res.csv(all);
                    }
                });
            });
        });
    });
};