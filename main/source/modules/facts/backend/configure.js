exports = module.exports = function(app, conf) 
{
    var hoy = new Date();
    var fechaHoy = hoy.getTime();
    
     function aMilisegundos (fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 12, 0, 0, 0);
        return date.getTime();
    };
    
     function estadoBAD (fecha, frecuencia) {
        if (fecha && frecuencia) {
            if (frecuencia != "0") {
                var diferencia = Math.round((fechaHoy - aMilisegundos(fecha)) / 86400000);
                if (diferencia > frecuencia) {
                    return (frecuencia - diferencia);
                } else {
                    return (-(diferencia - frecuencia));
                }
            } else {
                return 0;
            }
        }
    };
    
    function vencido (fact) {
        if (fact.fuente == "BA Data") {
            if (fact.ultimaActualizacion && fact.frecuencia) {
                if (estadoBAD(fact.ultimaActualizacion, fact.frecuencia) < 0) {
                    return "Vencido";
                } else {
                    return "Vigente";
                }
            } else {
                return "Vigente";
            }
        } else if ((fact.fuente == "Otra Publicación") || (fact.fuente == "Sin Calidad")) {
            if (fact.vencimiento) {
                if (aMilisegundos(fact.vencimiento) < fechaHoy) {
                    return "Vencido";
                } else {
                    return "Vigente";
                }
            } else {
                return "Vigente";
            }
        } else {
            return "Vigente";
        }
    }
    
    require('express-csv');
    app.get('/api/facts-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            var all = [
               ["Valor","Magnitud","Concepto","Fuente","Vigencia"]
            ];
           
            db.collection('facts').find({}).each(function(err, item) {
                    if (err) {
                        res.status(503);
                        console.log(err);
                        return res.end();
                    }
    
                    if (item) {
                        all.push([
                            item.valor.replace(",", "."),
                            item.magnitud,
                            item.concepto,
                            item.fuente || item.otrafuente, 
                            vencido(item) 
                            ])}
                    else {
                        res.setHeader("Content-Disposition", "attachment; filename=\"facts.csv\"");
                        res.csv(all);
                    }
             });
            
        });
    });
};