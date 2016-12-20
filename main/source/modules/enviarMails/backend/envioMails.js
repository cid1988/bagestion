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

    var crearMensaje = require('./configure').createMessage = function(de, asunto, texto, html, para, cc, cco, adjuntos){
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
                path: path.join(__dirname, "../../..", adjuntos[i].id)
            });
            // Opcionales a ver mañana
            //type: "/" + path.extname(adjuntos[i].algoXDDDDD),
            //name: ""
        }

        return message;
    };
    
    var enviarMail = require('./configure').enviarMail = function(usuario, contrasenna, texto, de, para, cc, cco, asunto, adjunto, callback){
        console.log("\n\n\tComienzo De Envio mail\n\n");
        var email = require('emailjs/email');

        var server = email.server.connect({
            user: usuario, //"temarios@buenosaires.gob.ar",
            password: contrasenna, //"sWg6DbeL!",
            host: "smtp.buenosaires.gob.ar",
            port: 25,
            ssl: false
        });

        var message = {
            text: texto,
            from: de,
            to: para,
            cc: cc,
            bcc: cco,
            subject: asunto,
            attachment: adjunto
        };

        server.send(message, function(err, mensaje){
            if(callback){
                return callback(err, mensaje);
            }
        });
    };
};