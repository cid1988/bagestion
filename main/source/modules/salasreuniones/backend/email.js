// API para enviar mails (temario, minuta)
exports = module.exports = function(app, conf) {
	var mongo = require('mongodb');
	var db = require('../../../db');
	var emails = require('../../emails/backend/locals');
	db.setConf(conf);
	
	var enviarMensaje = function(asunto, listaPara, listaCC, listaCCO, listaExclusivos, principioHtml, mensajeHtml, finHtml, adjunto, mailFrom, callback) {
        var Iconv  = require('iconv').Iconv;
        var iconv = new Iconv('UTF-8', 'US-ASCII//TRANSLIT');
        asunto = iconv.convert(asunto);
        
        if (mailFrom ==" ") {
            mailFrom = conf.temarios.email.from;
        }
		
		var buscarCorreo = function(lista) 
		{
		var emails = "";
            if (!lista) {
                return "";
            }
            else {
                var arrayMails = lista.split(',');
                for (var i = 0; i < arrayMails.length; i++) {
                    var em = arrayMails[i];
                    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if (!expr.test(em)) 
                    {
                        
                    } 
                    else 
                    {
                        if (emails === "") 
                        {
                            emails = em;
                        }
                        else 
                        {
                            emails = emails + ", " + em;
                        }
                    }
                }
            }
            return emails;
        };

		// En el formato 'Diego Pérez <eazel7@gmail.com>,Daniela Costa <dcosta@yahoo.com>
		var para = '';
		var cco = buscarCorreo(listaPara);
		var cc = '';
		//Aca le puse que todos los mails los ponga en cco porque no quieren que se vean.

		// ambos son html
		var html = principioHtml +
			mensajeHtml +
			'<hr />' +
			'<br />' +
			finHtml;
		html = '<div style="font-size: 24px; font-family: Arial; line-height: 150%">' + html + '</div>';
        
        /*
		var texto = require('html-to-text').fromString(html, {
			wordwrap: 130
		});
        */
        
		var emailMessage = emails.createMessage(
			mailFrom,
			asunto,
			'', html, para, cc, cco, adjunto,
		// TODO: CC no implementado
		'');

		emails.sendMail(emailMessage, callback);
	};

	app.post(conf.api.prefix + '/orm/enviar-reserva', function(req, res) {
		var payload = req.body;

		db.getDbInstance(function(err, db) {
			// Ahora db es una instancia de la base de datos, no un módulo
			if (err) {
				console.log(err);
				res.status(504);
				res.end();
			} else {
				db.collection('salasreuniones.instancias').findOne({
					_id: new mongo.ObjectID(payload.instanciaId)
				}, function(err, instancia) {
					if (err) {
						console.log(err);
						res.status(502);
						res.end();
					} else { 
						var mailFrom = " ";
						
						if (payload.desdeEmail) {
						    var mailFrom = payload.desdeEmail;
						}
						enviarMensaje(payload.asunto,
							payload.para,
							payload.cc,
							payload.cco,
							payload.exclusivos,
							payload.principioHtml,
							payload.texto,
							payload.finHtml,
							payload.adjunto,
							mailFrom, 
							function(err) {
							if (err) {
								console.log(err);
								res.status(503);
								res.end();
							} else {
								instancia.enviado = {
									fecha:  new Date(),
									para: payload.para,
									cc: payload.cc,
									cco: payload.cco,
									exclusivos: payload.exclusivos,
									asunto: payload.asunto,
									mensajeHtml: payload.mensajeHtml
								};

								console.log(instancia);
								
								db.collection('salasreuniones.instancias').save(instancia,{
									safe: true
								}, function (err) {
									if (err) {
										console.log(err);
										res.status(505);
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
