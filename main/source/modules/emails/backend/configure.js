exports = module.exports = function(app, conf) {
        var armarArray = function(array, preguntar, datoMostrar){
                var arrayRetornar = [], arrayLength = array.length;

                for( var i = 0; i < arrayLength; i++ ){
                        if( typeof array[i] == preguntar ){
                                arrayRetornar[arrayRetornar.length] = array[i][datoMostrar];
                            } else {
                                arrayRetornar[arrayRetornar.length] = array[i];
                            }
                }

                return arrayRetornar;
        };

        var createMessage = require('./locals').createMessage = function(from, subject, text, html, to, cc, bcc, attachment) {
        if (attachment == ""){
            var message = {
                text: text,
                from: from,
                to: to,
                cc: cc,
                bcc: bcc,
                subject: subject,
                attachment: [{
                    data: html,
                    alternative: true
                }]
            };
        } else {
            var message = {
                text: text,
                from: from,
                to: to,
                cc: cc,
                bcc: bcc,
                subject: subject,
                attachment: [{
                    data: html,
                    alternative: true
                },
                {path: require('path').join(__dirname, "../../..", attachment), type:"application/pdf", name:"temario.pdf"}]
            };
        }
        return message;
    };
    require('./locals').sendMail = function(message, callback) {
        var email = require('emailjs/email');
        console.log(conf);
        var server = email.server.connect({
            user: conf.email.smtp.username,
            password: conf.email.smtp.password,
            host: conf.email.smtp.host,
            port: conf.email.smtp.port,
            ssl: conf.email.smtp.useSsl
        });

        server.send(message, function(err, message) {
            if (callback) {
                console.log("\n\nCOMIENZO ENVIO MAIL 1"+JSON.stringify(message, null, 4)+"\n\n");
                return callback(err, message);
            }
        });
    };

    var crearMensaje2 = require('./locals').createMessage2 = function(de, asunto, texto, html, para, cc, cco, adjuntos){
        var message = {
            text: texto,
            from: de,
            to: armarArray( para, 'object', 'correoOficial' ).join(),
            cc: armarArray( cc, 'object', 'correoOficial' ).join(),
            bcc: armarArray( cco,'object', 'correoOficial' ).join(),
            subject: asunto,
            attachment: [{ data: html, alternative: true}]
        };

        var path = require('path'), lengthAdjuntos = adjuntos.length;

        for( var i = 0; i < lengthAdjuntos; i++ ){
            message.attachment.push({
                path: path.join(__dirname, "../../../uploads", adjuntos[i].id),
                name: ( "Archivo " + ( i + 1 ) + adjuntos[i].extencion),
            });
            //type: "/" + path.extname(adjuntos[i].algoXDDDDD)
            //type: "image/jpeg"
        }

        return message;
    };
    require('./locals').enviarMail2 = function(usuario, contrasenna, message, usuarioQueEnvia, callback){
        console.log("Comienzo De Envio mail 2");
        var email = require('emailjs/email');

        var server = email.server.connect({
            user: usuario,
            password: contrasenna,
            host: "smtp.buenosaires.gob.ar",
            port: 25,
            ssl: false
        });
        server.send(message, function(err, message){
            if( !err ){
                var mongo = require('mongodb'), db = require('../../../db');
                db.getDbInstance(function(err, db){
                    if(err){
                        console.log("Ocurrio un error al intentar conectarse al log");
                    } else {
                        var paraEnviar = message;
                        paraEnviar.hora = new Date();
                        paraEnviar.usuarioQueEnvia = usuarioQueEnvia;
                        db.collection('envioMails.mailsEnviadosLog').insert(paraEnviar, { w: 1 }, function(err, resultado){
                            if(err){
                                console.log("Ocurrio un error al guardar el log");
                            }
                        });
                    }
                });
            }
            console.log("err:"+JSON.stringify(err, null, 4));
            console.log("message:"+JSON.stringify(message, null, 4));
            if(callback){
                return callback(err, message);
            }
        });
    };
};

///ARREGLAR TODO