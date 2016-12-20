// API para enviar mails (temario, minuta)
exports = module.exports = function(app, conf) {
	var mongo = require('mongodb');
	var db = require('../../../db');
	var emails = require('../../emails/backend/locals');
	db.setConf(conf);
	
	var enviarMail = function(asunto, listaPara, textoHtml, adjunto, from, callback){
		var para = '';
		var cc = '';
		var cco = listaPara;
		var html = textoHtml;
		var Iconv  = require('iconv').Iconv;
        var iconv = new Iconv('UTF-8', 'US-ASCII//TRANSLIT');
        asunto = iconv.convert(asunto);
		/*html = '<div style="font-size: 24px; font-family: Roboto; line-height: 150%">' + html + '</div>';*/

		var texto = require('html-to-text').fromString(html, { wordwrap: 130 });

		var emailMessage = emails.createMessage(from,asunto,texto, html, para, cc, cco, adjunto);

		emails.sendMail(emailMessage, callback);
	};

	app.post(conf.api.prefix + '/qwerty/enviar-mail', function(req, res) {
		var payload = req.body;
        
		db.getDbInstance(function(err, db) {
			enviarMail(payload.asunto, payload.para, payload.mensajeHtml, payload.adjunto, payload.from, 
			function(err) 
			{
                if (err) 
	            {
    				console.log(err);
    				res.status(503);
    				res.end();
    			} 
    			else 
    			{
    			    res.json({});
    			}
		    })
		});
	});
};