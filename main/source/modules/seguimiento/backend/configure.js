exports = module.exports = function(app, conf, callback, nombresJurisdicciones) {
    require('./email.js')(app, conf);
    var doAll = function(db, res, nombresJurisdicciones, nombresReferentes, nombresTemas) {
        var jurisdiccionPorId = function(id) {
            for (var i = 0; i < nombresJurisdicciones.length; i++) {
                if (nombresJurisdicciones[i]._id == id) {
                    return nombresJurisdicciones[i];
                }
            }
        };
        
        var contactoPorId = function(id) {
            for (var i = 0; i < nombresReferentes.length; i++) {
                if (nombresReferentes[i] && nombresReferentes[i]._id) {
                    if (nombresReferentes[i]._id == id) {
                        return nombresReferentes[i];
                    }
                }
            }
        };
        
        var temaPorId = function(id) {
            for (var i = 0; i < nombresTemas.length; i++) {
                if (nombresTemas[i] && nombresTemas[i]._id) {
                    if (nombresTemas[i]._id == id) {
                        return nombresTemas[i].nombre;
                    }
                }
            }
        };
        
        var interesadosPorId = function(interesados) {
            var int = [];
            for(var i = 0; i < interesados.length; i++){
                for(var n = 0; n < nombresReferentes.length; n++){
                    if(interesados[i] == nombresReferentes[n]._id){
                        var a = contactoPorId(interesados[i]).apellidos + " " + contactoPorId(interesados[i]).nombre;
                        int.push(a);
                    }
                }
            }
            return int;
        };
        
        var temasPorId = function(temas) {
            var int = [];
            for(var i = 0; i < temas.length; i++){
                for(var n = 0; n < nombresTemas.length; n++){
                    if(temas[i] == nombresTemas[n]._id){
                        var a = temaPorId(temas[i]);
                        int.push(a);
                    }
                }
            }
            return int;
        };
        
        var all = [
            ["Título", "Tipo", "Tipo Expediente", "Año", "Número", "Repartición", "Jurisdiccion Responsable", "Responsable", "Interesados", "Camino Refrendos", "Proxima Reunión", "Descripción", "Temas", "Fecha Última Modificación"]
        ];
        
        db.collection('seguimiento.expedientes').find({}).each(function(err, item){
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            if(item){
                all.push([
                    item.titulo,
                    item.tema,
                    item.tipo,
                    item.ano,
                    item.numero,
                    item.reparticion,
                    item.jurisdiccion && jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).nombreCompleto,
                    item.responsable && contactoPorId(item.responsable) && contactoPorId(item.responsable).apellidos,
                    item.interesados && interesadosPorId(item.interesados),
                    item.caminoRefrendos,
                    item.fechaProxReunionSeg,
                    item.descripcion,
                    item.temas && temasPorId(item.temas),
                    item.fechaUltimaModificacion,
                ]);
            }
            else {
                res.setHeader("Content-Disposition", "attachment; filename=\"expedientes.csv\"");
                res.csv(all);
            }
        });
    };
    
    require('express-csv');
    app.get('/api/seguimiento-csv/download', function(req, res){
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            db.collection('orm.organigrama').find({}).toArray(function(err, nombresJurisdicciones){
                db.collection('orm.contactos').find({}).toArray(function(err, nombresReferentes){
                    db.collection('orm.temas').find({}).toArray(function(err, nombresTemas){
                        doAll(db, res, nombresJurisdicciones, nombresReferentes, nombresTemas);
                    });
                });
            });
        });
    });
    
    app.get('/api/pdfSade/:sade', function (req, res) {
        var request = require('request');
        var options = {};
        
        var body =
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<soapenv:Envelope ' +
                'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
                'xmlns:ar="http://ar.gob.gcaba.gedo.satra.services.external.consulta/">' +
                '<soapenv:Header/>' +
                '<soapenv:Body>' +
                    '<ar:consultarDocumentoPdf>' +
                    '<request>'+
                        '<numeroDocumento>' + req.params.sade + '</numeroDocumento>' +
                        '<usuarioConsulta>PPERELLO</usuarioConsulta>' +
                    '</request>'+
                    '</ar:consultarDocumentoPdf>' +
                '</soapenv:Body>' +
            '</soapenv:Envelope>';
            
        var options = {
            url: 'http://sade-mule.gcba.gob.ar/GEDOServices/consultaDocumento?wsdl',
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
            },
            uri: 'http://sade-mule.gcba.gob.ar/GEDOServices/consultaDocumento',
            method: 'POST',
            body: body,
        };
            
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        
        request(options, function (err, message, body) {
            if (err) {
                console.error(err);
                res.status(418);
                return res.end();
            }
            try{
                require('xml2js').parseString(body,{ignoreAttrs :true,explicitRoot :false,explicitArray:false},function (err, parsed) {
                    var consulta = parsed['soap:Body']['ns2:consultarDocumentoPdfResponse']['return'];
                    
                    function Base64Decode(str) {
                        if (!(/^[a-z0-9+/]+={0,2}$/i.test(str)) || str.length%4 != 0) throw Error('Not base64 string');
                    
                        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                        var o1, o2, o3, h1, h2, h3, h4, bits, d=[];
                    
                        for (var c=0; c<str.length; c+=4) {  // unpack four hexets into three octets
                            h1 = b64.indexOf(str.charAt(c));
                            h2 = b64.indexOf(str.charAt(c+1));
                            h3 = b64.indexOf(str.charAt(c+2));
                            h4 = b64.indexOf(str.charAt(c+3));
                    
                            bits = h1<<18 | h2<<12 | h3<<6 | h4;
                    
                            o1 = bits>>>16 & 0xff;
                            o2 = bits>>>8 & 0xff;
                            o3 = bits & 0xff;
                    
                            d[c/4] = String.fromCharCode(o1, o2, o3);
                            // check for padding
                            if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
                            if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
                        }
                        str = d.join('');  // use Array.join() for better performance than repeated string appends
                        return str;
                    }
                    res.setHeader("Content-Disposition", "attachment; filename=\"" + req.params.sade + ".pdf\"");
                    res.setHeader('Content-Type', 'octet/binary-stream')
                    res.send(Base64Decode(consulta));
                });
            }catch (e) {
                res.status(418);
                return res.end();
            }
        });
    });
    
    app.post('/api/consultaSade', function (req, res) {
        var request = require('request'),
        r = req.body;
        var body;
        var options = {};
        
        body =
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<soapenv:Envelope ' +
                'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
                'xmlns:ar="http://ar.gob.gcaba.ee.services.external/">' +
                '<soapenv:Header/>' +
                '<soapenv:Body>' +
                    '<ar:obtenerHistorialDePasesDeExpediente>' +
                        '<codigoEE>' + r.tipo + '-' + r.ano + '-' + r.numero + '-' + '   ' + '-' + 'MGEYA' + '-' + r.reparticion + '</codigoEE>' +
                    '</ar:obtenerHistorialDePasesDeExpediente>' +
                '</soapenv:Body>' +
            '</soapenv:Envelope>';
        
        // body =
        //     '<?xml version="1.0" encoding="utf-8"?>' +
        //     '<soapenv:Envelope ' +
        //         'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
        //         'xmlns:ar="http://ar.gob.gcaba.ee.services.external/">' +
        //         '<soapenv:Header/>' +
        //         '<soapenv:Body>' +
        //             '<ar:obtenerHistorialDePasesDeExpediente>' +
        //                 '<codigoEE>' + 'EX-2012-00028981- -MGEYA-MGEYA' + '</codigoEE>' +
        //             '</ar:obtenerHistorialDePasesDeExpediente>' +
        //         '</soapenv:Body>' +
        //     '</soapenv:Envelope>';
        
        options = {
            url: 'http://sade-mule.gcba.gob.ar/EEServices/consulta?wsdl',
            // url: 'http://sade-mule.hml.gcba.gob.ar:8180/EEServices/consulta?wsdl',
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
            },
            uri: 'http://sade-mule.gcba.gob.ar/EEServices/consulta',
            // uri: 'http://sade-mule.hml.gcba.gob.ar:8180/EEServices/consulta',
            method: 'POST',
            body: body,
        };
        
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        
        request(options, function (err, message, body) {
            if (err) {
                console.error(err);
                res.status(418);
                return res.end();
            }
            try{
                require('xml2js').parseString(body,{ignoreAttrs :true,explicitRoot :false,explicitArray:false},function (err, parsed) {
                    var consulta = parsed['soap:Body']['ns2:obtenerHistorialDePasesDeExpedienteResponse']['return'];
                    res.send(consulta);
                });
            }catch (e) {
                console.error(err);
                res.status(418);
                return res.end();
            }
        });
    });
};