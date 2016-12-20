// API para enviar mails (temario, minuta)
exports = module.exports = function(app, conf) {
	var mongo = require('mongodb');
	var db = require('../../../db');
	var emails = require('../../emails/backend/locals');
	db.setConf(conf);
	
	var enviarMail = function(asunto, listaPara, textoHtml, adjunto, from, callback) {
		
		var buscarCorreo = function(contactoMail) {
		    var emails = "";
            if (!contactoMail) {
                return "";
            }
            else {
                var em = contactoMail;
                var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if ( !expr.test(contactoMail) ) {
                    
                } else {
                    if (emails === "") {
                        emails = contactoMail;
                    } else {
                        emails = emails + ", " + contactoMail;
                    }
                }
            }
            return emails;
        };

		var para = '';
		var cc = '';
		var cco = '';
		//Aca le puse que todos los mails los ponga en cco porque no quieren que se vean.
		
    	cco =  buscarCorreo(listaPara);

		// ambos son html
		var html = textoHtml;
		 /*html = '<div style="font-size: 24px; font-family: Arial; line-height: 150%">' + html + '</div>';*/

		var texto = require('html-to-text').fromString(html, {
			wordwrap: 130
		});

		var emailMessage = emails.createMessage(
			from,
			asunto,
			texto, html, para, cc, cco, adjunto,
		// TODO: CC no implementado
		'');

		emails.sendMail(emailMessage, callback);
	};

	app.post(conf.api.prefix + '/fiscales/enviar-mail', function(req, res) {
		var payload = req.body;

		db.getDbInstance(function(err, db) {
			if (err) {
				console.log(err);
				res.status(503);
				res.end();
			} else {
				db.collection('fiscales').findOne({
					_id: new mongo.ObjectID(payload.fiscalId)
				}, function(err, instancia) {
					if (err) {
						console.log(err);
						res.status(503);
						res.end();
					} else {
						enviarMail(payload.asunto,
							payload.para,
							payload.mensajeHtml,
							payload.adjunto, 
							payload.from, function(err) {
							if (err) {
								console.log(err);
								res.status(503);
								res.end();
							} else {
								instancia.mailEnviado = {
									fecha:  new Date(),
									from: payload.patrocinador
								};

								console.log(instancia);
								db.collection('fiscales').save(instancia,{
									safe: true
								}, function (err) {
									if (err) {
										console.log(err);
										res.status(503);
										res.end();
									} else {
										res.json({});
									}
								});
							}
						});
					}
				});
			}
		});
	});
};
