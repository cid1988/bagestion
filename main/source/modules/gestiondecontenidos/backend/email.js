// API para enviar mails (temario, minuta)
exports = module.exports = function(app, conf) {
	var mongo = require('mongodb');
	var db = require('../../../db');
	var emails = require('../../emails/backend/locals');
	db.setConf(conf);
	
	var enviarMail = function(asunto, listaPara, textoHtml, adjunto, from, callback) 
	{
		var buscarCorreo = function(contactoMail) 
		{
            var mails=contactoMail.split(",");

            var emails = "";
            for(var i=0; i<mails.length; i++)
            {
                mails[i]=mails[i].replace(" ", "");
                if (!mails[i]) 
                {
                    return "";
                }
                else 
                {
                    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if ( expr.test(mails[i]) ) 
                    {
                        if (emails == "") 
                        {
                            emails = mails[i];
                        }
                        else 
                        {
                            emails = emails + "," + mails[i];
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
		
        cco =  buscarCorreo(listaPara);
		var html = textoHtml;
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

    app.post(conf.api.prefix + '/gestiondecontenidos/enviar-mail', function(req, res) {
		var payload = req.body;
		
		db.getDbInstance(function(err, db) {
			if (err) {
				console.log(err);
				res.status(503);
				res.end();
			} else {
				db.collection('gestiondecontenidos').findOne({
					_id: new mongo.ObjectID(payload.iGestionid)
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
									from: payload.emisor
								};

								db.collection('gestiondecontenidos').save(instancia,{
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
         //EN CASO DE EMERGENCIA, DESCOMENTAR
         /*
		db.getDbInstance(function(err, db) 
		{
		    if (err) {
				console.log(err);
				res.status(503);
				res.end();
			} 
			else
			{
		        enviarMail(payload.asunto,
				    payload.para,
				    payload.mensajeHtml,
				    payload.adjunto, 
				    payload.from, function(err) {
				    if (err) {
				    console.log(err);
				    res.status(503);
				    res.end();
				    }
			    });
			}
		});
		*/
		
	});
};
