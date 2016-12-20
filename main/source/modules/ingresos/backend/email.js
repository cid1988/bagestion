exports = module.exports = function(app, conf) {
	var mongo = require('mongodb');
	var db = require('../../../db');
	var emails = require('../../emails/backend/locals');
	db.setConf(conf);
	
	var enviarMail = function(asunto, listaPara, textoHtml, from, adjunto, callback) 
	{
		var para = listaPara;
		var cc = '';
		var cco = '';
		var html = textoHtml;

		var texto = require('html-to-text').fromString(html, { wordwrap: 130 });

		var emailMessage = emails.createMessage(from,asunto,texto, html, para, cc, cco, adjunto,'');
		emails.sendMail(emailMessage, callback);
	};

	app.post(conf.api.prefix + '/ingreso/enviar-mail', function(req, res) {
		var payload = req.body;
        
		db.getDbInstance(function(err, db) {
			enviarMail(payload.asunto, payload.para, payload.mensajeHtml, payload.from, payload.adjunto, 
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
            });
        });
    });
};
