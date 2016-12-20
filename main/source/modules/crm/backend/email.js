// API para enviar mails (temario, minuta)
exports = module.exports = function(app, conf) {
	var mongo = require('mongodb');
	var db = require('../../../db');
	var emails = require('../../emails/backend/locals');
	db.setConf(conf);
	
	var enviarMail = function(contactos, asunto, listaPara, textoHtml, adjunto, from, callback) {
		var contactosPorId = {};
        
		contactos.forEach(function(c) {
			contactosPorId[c._id.toString()] = c;
		});
		
		var buscarCorreo = function(contacto) {
		    var emails = "";
            if (!contacto.correos) {
                return "";
            }
            else {
                for (var i = 0; i < contacto.correos.length; i++) {
                    var em = contacto.correos[i];
                    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if ( !expr.test(em.valor) ) {
                        
                    } else {
                        if (emails === "") {
                            emails = em.valor;
                        } else {
                            emails = emails + ", " + em.valor;
                        }
                    }
                }
            }
            return emails;
        };

		var para = '';
		var cc = '';
		var cco = '';
		//Aca le puse que todos los mails los ponga en cco porque no quieren que se vean.

		listaPara.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo(contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo(contacto);
            }
		});

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

	app.post(conf.api.prefix + '/crm/enviar-mail', function(req, res) {
		var payload = req.body;

		db.getDbInstance(function(err, db) {
			if (err) {
				console.log(err);
				res.status(503);
				res.end();
			} else {
				db.collection('crm.reportes').findOne({
					_id: new mongo.ObjectID(payload.reporteId)
				}, function(err, instancia) {
					if (err) {
						console.log(err);
						res.status(503);
						res.end();
					} else {
						var queryContactos = {
							_id: {
								$in: []
							}
						};

						payload.para && payload.para.forEach(function(c) {
							queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
						});

						db.collection('crm.contactos').find(queryContactos, function(err, docs) {
							if (err) {
								console.log(err);
								res.status(503);
								res.end();
							} else {
								docs.toArray(function(err, contactos) {
									enviarMail(contactos,
										payload.asunto,
										payload.para,
										payload.mensajeHtml,
										payload.adjunto, 
										payload.from, function(err) {
										if (err) {
											console.log(err);
											res.status(503);
											res.end();
										} else {
											instancia.mail = {
												fecha:  new Date(),
												para: payload.para,
												asunto: payload.asunto,
												mensajeHtml: payload.mensajeHtml,
												from: payload.from
											};

											console.log(instancia);
											// el temario fue enviado correctamente
											db.collection('crm.reportes').save(instancia,{
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
								});
							}
						});
					}
				});
			}
		});
	});
};
