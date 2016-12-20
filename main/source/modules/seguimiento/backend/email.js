// API para enviar mails (temario, minuta)
exports = module.exports = function(app, conf) {
	var db = require('../../../db');
	var emails = require('../../emails/backend/locals');
	db.setConf(conf);
	
	var enviarMensajeExpediente = function(asunto, listaPara, textoHtml, adjunto, from, callback) {
		var para = listaPara;
		var cc = '';
		var cco = '';
		
		// ambos son html
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

	app.post(conf.api.prefix + '/seguimiento/enviar-mail', function(req, res) {
		var payload = req.body;
		
		db.getDbInstance(function(err, db) {
			enviarMensajeExpediente(payload.asunto,
				payload.para,
				payload.mensajeHtml,
				payload.adjunto, 
				payload.from,function(err) {
					if (err) {
						console.log(err);
						res.status(503);
						res.end();
					} else {
				        res.json({});
					}
				}
			);
		});
	});
};
